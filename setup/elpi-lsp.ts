/*
 * The Elpi language server, shared by setup/monaco.ts (diagnostics and
 * hover in the editors) and setup/code-runners.ts (running programs).
 *
 * The server is elpi-lsp compiled to JavaScript, public/elpi-lsp-web.js, run
 * in a web worker; it speaks LSP (JSON-RPC) with postMessage. It is built in
 * the elpi repository by `make build-lsp-web` (lsp/elpi-lsp-web.js).
 * Besides the standard LSP requests it answers
 *   elpi/run { text | textDocument: { uri }, query, maxSteps? }
 *     -> { status: 'success' | 'failure' | 'error', output, errors: string[] }
 * (running out of steps is a failure with the error "no more steps").
 */

export interface Diagnostic {
  range: { start: { line: number, character: number }, end: { line: number, character: number } }
  severity?: number
  message: string
  source?: string
}
export interface RunResult {
  status: 'success' | 'failure' | 'error'
  output: string
  errors: string[]
}

class ElpiLsp {
  private worker: Worker
  private pending = new Map<number, (result: any) => void>()
  private nextId = 1
  private ready: Promise<void>
  onDiagnostics: (uri: string, diagnostics: Diagnostic[]) => void = () => {}

  constructor() {
    this.worker = new Worker(`${import.meta.env.BASE_URL}elpi-lsp-web.js`)
    this.worker.onmessage = ({ data }) => {
      if (data.id !== undefined && this.pending.has(data.id)) {
        this.pending.get(data.id)!(data.result)
        this.pending.delete(data.id)
      }
      else if (data.method === 'textDocument/publishDiagnostics') {
        this.onDiagnostics(data.params.uri, data.params.diagnostics)
      }
    }
    this.worker.onerror = e => console.error('[elpi-lsp]', e.message)
    this.ready = this.send('initialize', {
      processId: null,
      rootUri: null,
      capabilities: {},
      initializationOptions: { maxErrors: 100 },
    }).then(() => this.post({ method: 'initialized', params: {} }))
  }

  private post(msg: object) {
    this.worker.postMessage({ jsonrpc: '2.0', ...msg })
  }

  private send(method: string, params: object): Promise<any> {
    return new Promise((resolve) => {
      const id = this.nextId++
      this.pending.set(id, resolve)
      this.post({ id, method, params })
    })
  }

  async request(method: string, params: object): Promise<any> {
    await this.ready
    return this.send(method, params)
  }

  async notify(method: string, params: object) {
    await this.ready
    this.post({ method, params })
  }

  open(uri: string, text: string, version: number) {
    return this.notify('textDocument/didOpen', { textDocument: { uri, languageId: 'elpi', version, text } })
  }

  change(uri: string, text: string, version: number) {
    return this.notify('textDocument/didChange', { textDocument: { uri, version }, contentChanges: [{ text }] })
  }

  close(uri: string) {
    return this.notify('textDocument/didClose', { textDocument: { uri } })
  }

  // runs `query` in the program `text`, for at most `maxSteps` steps
  // (a loop stops in about a second with the default)
  run(text: string, { query = 'main', maxSteps = 1_000_000 } = {}): Promise<RunResult> {
    return this.request('elpi/run', { text, query, maxSteps })
  }
}

let instance: ElpiLsp | undefined

export function elpiLsp(): ElpiLsp {
  instance ??= new ElpiLsp()
  return instance
}
