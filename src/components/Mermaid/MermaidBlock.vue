<!-- MermaidBlock.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{ code: string; id?: string }>()
const svgRef = ref<HTMLDivElement | null>(null)
const error = ref<string | null>(null)

async function render() {
  if (!svgRef.value) return
  try {
    // Dynamic import mermaid to avoid SSR issues
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' })
    const id = `mermaid-${props.id ?? Math.random().toString(36).slice(2)}`
    const { svg } = await mermaid.render(id, props.code)
    svgRef.value.innerHTML = svg
    error.value = null
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Render failed'
  }
}

onMounted(render)
watch(() => props.code, render)
</script>

<template>
  <div class="ac-mermaid my-3">
    <div v-if="error" class="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
      Mermaid error: {{ error }}
    </div>
    <div
      v-else
      ref="svgRef"
      class="flex justify-center p-4 bg-white border border-[var(--ac-border,#e5e7eb)] rounded-xl overflow-x-auto"
    />
  </div>
</template>
