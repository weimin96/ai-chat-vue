export interface ShikiPreloadOptions {
  themes?: string[]
  langs?: string[]
}

type ShikiHighlighter = Awaited<ReturnType<typeof import('shiki')['createHighlighter']>>

let preloadPromise: Promise<ShikiHighlighter> | null = null

export function preloadShiki(options: ShikiPreloadOptions = {}): Promise<ShikiHighlighter> {
  if (!preloadPromise) {
    preloadPromise = createShikiHighlighter(options)
  }

  return preloadPromise
}

export function getPreloadedShikiHighlighter(): Promise<ShikiHighlighter> | null {
  return preloadPromise
}

async function createShikiHighlighter(options: ShikiPreloadOptions) {
  const { createHighlighter } = await import('shiki')

  return createHighlighter({
    themes: options.themes ?? ['github-dark'],
    langs: options.langs ?? ['text', 'javascript', 'typescript', 'vue', 'json', 'bash', 'markdown'],
  })
}
