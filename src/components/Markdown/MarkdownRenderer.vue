<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const props = withDefaults(defineProps<{
  content: string
  isStreaming?: boolean
  allowHtml?: boolean
}>(), {
  allowHtml: false,
})

// Inline markdown parser (lightweight, no external dep needed for basic GFM)
function parseMarkdown(text: string): string {
  let html = text
    // Escape HTML (unless allowed)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre data-lang="${lang}"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
    )
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="ac-inline-code">$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="ac-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="ac-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="ac-h1">$1</h1>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="ac-blockquote">$1</blockquote>')
    // Unordered list
    .replace(/^[\-\*] (.+)$/gm, '<li class="ac-li">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, s => `<ul class="ac-ul">${s}</ul>`)
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, '<li class="ac-li">$1</li>')
    // Task list
    .replace(/^- \[x\] (.+)$/gm, '<li class="ac-task done">✅ $1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="ac-task">☐ $1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="ac-link">$1</a>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="ac-hr" />')
    // Paragraph breaks
    .replace(/\n\n/g, '</p><p class="ac-p">')

  return `<p class="ac-p">${html}</p>`
    .replace(/<p class="ac-p"><\/p>/g, '')
    .replace(/<p class="ac-p">(<(?:h[1-6]|pre|ul|ol|blockquote|hr)[^>]*>)/g, '$1')
    .replace(/(<\/(?:h[1-6]|pre|ul|ol|blockquote|hr)>)<\/p>/g, '$1')
}

const rendered = computed(() => parseMarkdown(props.content))
</script>

<template>
  <div
    class="ac-markdown prose-sm max-w-none"
    v-html="rendered"
  />
</template>

<style>
.ac-markdown .ac-p { margin: 0.375rem 0; line-height: 1.7; }
.ac-markdown .ac-h1 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.ac-markdown .ac-h2 { font-size: 1.1rem; font-weight: 600; margin: 0.875rem 0 0.375rem; }
.ac-markdown .ac-h3 { font-size: 1rem; font-weight: 600; margin: 0.75rem 0 0.25rem; }
.ac-markdown .ac-ul { list-style: disc; padding-left: 1.25rem; margin: 0.375rem 0; }
.ac-markdown .ac-li { margin: 0.125rem 0; }
.ac-markdown .ac-blockquote { border-left: 3px solid var(--ac-primary, #6366f1); padding-left: 0.75rem; color: var(--ac-muted, #6b7280); margin: 0.5rem 0; font-style: italic; }
.ac-markdown .ac-link { color: var(--ac-primary, #6366f1); text-decoration: underline; text-underline-offset: 2px; }
.ac-markdown .ac-link:hover { opacity: 0.8; }
.ac-markdown .ac-hr { border: none; border-top: 1px solid var(--ac-border, #e5e7eb); margin: 0.75rem 0; }
.ac-markdown .ac-inline-code { background: rgba(99,102,241,0.08); color: #6366f1; padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.875em; font-family: 'Fira Code', 'Cascadia Code', monospace; }
.ac-markdown pre { background: #1e1e2e; color: #cdd6f4; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0; font-size: 0.8rem; font-family: 'Fira Code', monospace; line-height: 1.6; }
.ac-markdown pre code { background: none; color: inherit; padding: 0; }
.ac-markdown strong { font-weight: 600; }
.ac-markdown em { font-style: italic; }
.ac-markdown del { text-decoration: line-through; color: var(--ac-muted, #9ca3af); }
</style>
