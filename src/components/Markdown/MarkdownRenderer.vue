<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { renderMarkdown } from './markdown'

const props = withDefaults(defineProps<{
  content: string
  isStreaming?: boolean
  allowHtml?: boolean
  debounceMs?: number
}>(), {
  allowHtml: false,
  debounceMs: 50,
})

const rendered = ref('')

let renderTimer: ReturnType<typeof setTimeout> | null = null

function clearRenderTimer() {
  if (!renderTimer) return
  clearTimeout(renderTimer)
  renderTimer = null
}

function renderNow() {
  clearRenderTimer()
  rendered.value = renderMarkdown(props.content, { allowHtml: props.allowHtml })
}

function scheduleRender() {
  clearRenderTimer()
  if (!props.isStreaming || props.debounceMs <= 0) {
    renderNow()
    return
  }
  renderTimer = setTimeout(renderNow, props.debounceMs)
}

watch(
  () => [props.content, props.allowHtml, props.isStreaming, props.debounceMs] as const,
  scheduleRender,
  { immediate: true }
)

onBeforeUnmount(clearRenderTimer)
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
