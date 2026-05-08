import DOMPurify from 'dompurify'

export interface RenderMarkdownOptions {
  allowHtml?: boolean
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function parseMarkdown(text: string, options: RenderMarkdownOptions = {}): string {
  let html = options.allowHtml ? text : escapeHtml(text)

  html = html
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre data-lang="${lang}"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
    )
    .replace(/`([^`]+)`/g, '<code class="ac-inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/^### (.+)$/gm, '<h3 class="ac-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="ac-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="ac-h1">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="ac-blockquote">$1</blockquote>')
    .replace(/^- \[x\] (.+)$/gim, '<li class="ac-task done">[x] $1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="ac-task">[ ] $1</li>')
    .replace(/^[*-] (.+)$/gm, '<li class="ac-li">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, s => `<ul class="ac-ul">${s}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li class="ac-li">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="ac-link">$1</a>')
    .replace(/^---$/gm, '<hr class="ac-hr" />')
    .replace(/\n\n/g, '</p><p class="ac-p">')

  return `<p class="ac-p">${html}</p>`
    .replace(/<p class="ac-p"><\/p>/g, '')
    .replace(/<p class="ac-p">(<(?:h[1-6]|pre|ul|ol|blockquote|hr)[^>]*>)/g, '$1')
    .replace(/(<\/(?:h[1-6]|pre|ul|ol|blockquote|hr)>)<\/p>/g, '$1')
}

export function renderMarkdown(text: string, options: RenderMarkdownOptions = {}): string {
  const purifier = DOMPurify as unknown as {
    sanitize?: (html: string, config?: { ADD_ATTR?: string[] }) => string
  }
  const html = parseMarkdown(text, options)

  if (!purifier.sanitize) {
    return html
  }

  return purifier.sanitize(html, {
    ADD_ATTR: ['target'],
  })
}
