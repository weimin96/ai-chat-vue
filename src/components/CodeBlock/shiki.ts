export interface ShikiPreloadOptions {
  themes?: string[]
  langs?: string[]
}

type ShikiHighlighter = Awaited<ReturnType<typeof import('shiki')['createHighlighter']>>

const defaultLanguages = [
  'text',
  'javascript',
  'typescript',
  'vue',
  'json',
  'bash',
  'markdown',
  'html',
  'css',
  'tsx',
  'jsx',
  'python',
  'sql',
]

const languageAliases: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  md: 'markdown',
  plaintext: 'text',
}

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

export function resolveShikiLanguage(language?: string): string {
  const normalized = (language ?? 'text').trim().toLowerCase()
  const resolved = languageAliases[normalized] ?? normalized

  return defaultLanguages.includes(resolved) ? resolved : 'text'
}

async function createShikiHighlighter(options: ShikiPreloadOptions) {
  const { createHighlighter } = await import('shiki')

  return createHighlighter({
    themes: options.themes ?? ['github-dark'],
    langs: options.langs ?? defaultLanguages,
  })
}
