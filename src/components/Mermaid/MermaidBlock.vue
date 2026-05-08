<!-- MermaidBlock.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

type MermaidApi = typeof import('mermaid')['default']

const props = defineProps<{ code: string; id?: string; isStreaming?: boolean }>()
const svgRef = ref<HTMLDivElement | null>(null)
const error = ref<string | null>(null)
const renderId = `mermaid-${props.id ?? Math.random().toString(36).slice(2)}`

let mermaidApi: MermaidApi | null = null
let mermaidInitialized = false

async function loadMermaid() {
  if (!mermaidApi) {
    mermaidApi = (await import('mermaid')).default
  }

  if (!mermaidInitialized) {
    mermaidApi.initialize({ startOnLoad: false, theme: 'neutral' })
    mermaidInitialized = true
  }

  return mermaidApi
}

async function render() {
  if (!svgRef.value || props.isStreaming) return
  try {
    const mermaid = await loadMermaid()
    const { svg } = await mermaid.render(renderId, props.code)
    svgRef.value.innerHTML = svg
    error.value = null
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '渲染失败'
  }
}

onMounted(render)
watch(
  () => [props.code, props.isStreaming] as const,
  async () => {
    if (props.isStreaming) {
      if (svgRef.value) svgRef.value.innerHTML = ''
      error.value = null
      return
    }
    await render()
  }
)
</script>

<template>
  <div class="ac-mermaid my-3">
    <pre
      v-if="isStreaming"
      class="text-xs bg-[#1e1e2e] text-[#cdd6f4] rounded-lg p-3 overflow-x-auto"
    ><code>{{ code }}</code></pre>
    <div v-if="error" class="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
      Mermaid 错误：{{ error }}
    </div>
    <div
      v-else-if="!isStreaming"
      ref="svgRef"
      class="flex justify-center p-4 bg-white border border-[var(--ac-border,#e5e7eb)] rounded-xl overflow-x-auto"
    />
  </div>
</template>
