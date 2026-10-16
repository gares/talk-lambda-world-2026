import { defineAppSetup } from '@slidev/types'
import { useLocalStorage } from '@vueuse/core'

// The deck is designed dark: start dark on a first visit, but keep
// whatever the presenter picked with the toolbar toggle afterwards.
// (Slidev stores its choice in 'slidev-color-schema' and writes 'auto'
// there before this runs, so a separate key marks the first visit.)
// Automated browsers (`slidev export`) are left alone, so that
// `export --dark` / plain `export` pick dark / light as usual.
export default defineAppSetup(() => {
  if (typeof navigator !== 'undefined' && navigator.webdriver)
    return
  const initialized = useLocalStorage('lw-color-schema-initialized', false)
  if (!initialized.value) {
    useLocalStorage('slidev-color-schema', 'auto').value = 'dark'
    initialized.value = true
  }
})
