import { defineConfig } from 'vite'

// The word "Elpi" in the text of the slides becomes the ELPI wordmark
// (components/ElpiLogo.vue). Only plain text is changed: code (blocks and
// inline), HTML attributes, links' targets and frontmatter are left alone.
function elpiLogo(md: any) {
  md.core.ruler.after('inline', 'elpi-logo', (state: any) => {
    for (const block of state.tokens) {
      if (block.type !== 'inline' || !block.children)
        continue
      const children = []
      for (const tok of block.children) {
        if (tok.type !== 'text' || !/\bElpi\b/.test(tok.content)) {
          children.push(tok)
          continue
        }
        tok.content.split(/\b(Elpi)\b/).forEach((part: string, i: number) => {
          if (part === '')
            return
          const t = new state.Token(i % 2 ? 'html_inline' : 'text', '', 0)
          t.content = i % 2 ? '<ElpiLogo />' : part
          children.push(t)
        })
      }
      block.children = children
    }
  })
}

export default defineConfig({
  slidev: {
    markdown: {
      markdownSetup(md) {
        md.use(elpiLogo)
      },
    },
  },
})
