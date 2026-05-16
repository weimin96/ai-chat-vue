import DOMPurify from 'dompurify'
import { marked } from 'marked'

export interface RenderMarkdownOptions {
  allowHtml?: boolean
}

interface Purifier {
  sanitize?: (html: string, config?: { ADD_ATTR?: string[] }) => string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function enhanceLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>/g, (_tag, attrs: string) => {
    let nextAttrs = attrs
    if (!/\starget\s*=/.test(nextAttrs)) nextAttrs += ' target="_blank"'
    if (!/\srel\s*=/.test(nextAttrs)) nextAttrs += ' rel="noopener noreferrer"'
    return `<a${nextAttrs}>`
  })
}

function stripUnsafeProtocols(html: string): string {
  return html.replace(/\s(?:href|src)=["']\s*(?:javascript|vbscript|data):[^"']*["']/gi, '')
}

export function parseMarkdown(text: string, options: RenderMarkdownOptions = {}): string {
  const source = options.allowHtml ? text : escapeHtml(text)

  return marked.parse(source, {
    async: false,
    breaks: true,
    gfm: true,
  })
}

export function renderMarkdown(text: string, options: RenderMarkdownOptions = {}): string {
  const html = enhanceLinks(parseMarkdown(text, options))
  const purifier = DOMPurify as unknown as Purifier

  if (!purifier.sanitize) {
    return stripUnsafeProtocols(html)
  }

  return purifier.sanitize(html, {
    ADD_ATTR: ['target', 'rel', 'class', 'type', 'checked', 'disabled'],
  })
}
