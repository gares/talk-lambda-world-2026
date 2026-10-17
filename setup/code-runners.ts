/*
 * Elpi code runner for Slidev.
 *
 * Programs run in the Elpi language server (setup/elpi-lsp.ts, method
 * elpi/run), the same one that gives diagnostics and hover in the editors.
 * The query is `main`, run for at most 1e6 steps: a loop stops in about a
 * second with the error "no more steps".
 *
 * Usage in slides.md: an editable block, run on load and on every edit,
 * with the output below it: what the program printed, the errors of the
 * query and of the run, and Success./Failure./Error. The errors and warnings
 * of the program are not repeated there: they are underlined in the code
 * (setup/monaco.ts).
 *
 *   ```elpi {monaco-run}
 *   main :- print "hello".
 *   ```
 *
 * Standard Slidev options apply, e.g.
 *   ```elpi {monaco-run} {autorun:false}        run only via the play button
 *   ```elpi {monaco-run} {showOutputAt:'+1'}    reveal the output on a click
 *   ```elpi {monaco-run} {outputHeight:'10rem'} fixed height for the output
 *
 * Output on the right instead of below: Slidev always renders the output
 * under the editor, inside the same `.slidev-monaco-container`, so a CSS grid
 * on that container puts them side by side. Wrap the block in an element with
 * a class of your choice (keep the blank lines, or the block is not parsed
 * as markdown):
 *
 *   <div class="run-side">
 *
 *   ```elpi {monaco-run}
 *   main :- print "hello".
 *   ```
 *
 *   </div>
 *
 * and add to a stylesheet (e.g. styles/index.css); the container's second
 * child is the output pane, whose top border becomes a left one:
 *
 *   .run-side .slidev-monaco-container {
 *     display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
 *   }
 *   .run-side .slidev-monaco-container > div:nth-child(2) {
 *     border-top: 0; border-left: 1px solid #333;
 *   }
 *
 * The class can also go on the slide (`class: run-side` in its frontmatter)
 * to affect every runnable block of that slide.
 */

import { defineCodeRunnersSetup } from '@slidev/types'
import { elpiLsp } from './elpi-lsp'

// Escape Elpi's output and keep its line breaks as <br/>.
function toHtml(text: string, cls?: string) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
  return { html: cls ? `<span class="${cls}">${escaped}</span>` : escaped }
}

export default defineCodeRunnersSetup(() => {
  return {
    async elpi(code) {
      // diagnostics are left out: they are underlined in the editor
      const { status, output, errors } = await elpiLsp().run(code)
      const out = []
      if (output.trim() !== '')
        out.push(toHtml(output.trimEnd()))
      for (const e of errors)
        out.push(toHtml(e.trimEnd(), 'text-red-500'))
      if (status === 'success')
        out.push({ text: 'Success.', class: 'text-green-500' })
      else if (status === 'failure')
        out.push({ text: 'Failure.', class: 'text-orange-500' })
      else
        out.push({ text: 'Error.', class: 'text-red-500' })
      return out
    },
  }
})
