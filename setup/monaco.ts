/*
 * Diagnostics and hover for the Elpi Monaco editors of the slides
 * (```elpi {monaco} and ```elpi {monaco-run} blocks), from the Elpi language
 * server of setup/elpi-lsp.ts.
 *
 * Every editor is a separate document (file:///ID.elpi, created by Slidev):
 * the server checks it on every change and publishes diagnostics, shown as
 * Monaco markers; hovering asks the server for the type of what is under the
 * mouse.
 */

import type { Diagnostic } from './elpi-lsp'
import { defineMonacoSetup } from '@slidev/types'
import { elpiLsp } from './elpi-lsp'

type Monaco = typeof import('monaco-editor')
type Range = Diagnostic['range']

let started = false

function setupElpi(monaco: Monaco) {
  const lsp = elpiLsp()

  const severity = [
    monaco.MarkerSeverity.Error, // LSP severities start at 1
    monaco.MarkerSeverity.Error,
    monaco.MarkerSeverity.Warning,
    monaco.MarkerSeverity.Info,
    monaco.MarkerSeverity.Hint,
  ]
  const toRange = (r: Range) => new monaco.Range(
    r.start.line + 1, r.start.character + 1, r.end.line + 1, r.end.character + 1)

  lsp.onDiagnostics = (uri, diagnostics) => {
    const model = monaco.editor.getModel(monaco.Uri.parse(uri))
    if (!model)
      return
    monaco.editor.setModelMarkers(model, 'elpi', diagnostics.map(d => ({
      ...toRange(d.range),
      severity: severity[d.severity ?? 1],
      message: d.message,
      source: d.source,
    })))
  }

  // documents: one per Elpi editor
  const track = (model: import('monaco-editor').editor.ITextModel) => {
    if (model.getLanguageId() !== 'elpi')
      return
    const uri = model.uri.toString()
    lsp.open(uri, model.getValue(), model.getVersionId())
    let timer: ReturnType<typeof setTimeout> | undefined
    const change = model.onDidChangeContent(() => {
      clearTimeout(timer)
      timer = setTimeout(() => lsp.change(uri, model.getValue(), model.getVersionId()), 300)
    })
    model.onWillDispose(() => {
      clearTimeout(timer)
      change.dispose()
      lsp.close(uri)
    })
  }
  monaco.editor.getModels().forEach(track)
  monaco.editor.onDidCreateModel(track)

  // hover: the type of the symbol under the mouse
  monaco.languages.registerHoverProvider('elpi', {
    async provideHover(model, position) {
      const hover = await lsp.request('textDocument/hover', {
        textDocument: { uri: model.uri.toString() },
        position: { line: position.lineNumber - 1, character: position.column - 1 },
      })
      if (!hover)
        return null
      const contents = (Array.isArray(hover.contents) ? hover.contents : [hover.contents])
        .map((c: any) => typeof c === 'string' ? c : c.value ?? '')
        .map((value: string) => ({ value: value.replace(/```elpi-hover/g, '```elpi') }))
      return { contents, range: hover.range && toRange(hover.range) }
    },
  })
}

export default defineMonacoSetup((monaco) => {
  if (!started) {
    started = true
    setupElpi(monaco as unknown as Monaco)
  }
})
