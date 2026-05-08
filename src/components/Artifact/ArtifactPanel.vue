<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Artifact } from '../../types'

const props = defineProps<{ artifact: Artifact }>()
const _emit = defineEmits<{ update: [content: string] }>()

const activeTab = ref<'preview' | 'source'>('preview')
const isFullscreen = ref(false)

const previewSrc = computed(() => {
  if (props.artifact.type === 'html') {
    const blob = new Blob([props.artifact.content], { type: 'text/html' })
    return URL.createObjectURL(blob)
  }
  return null
})

const typeIcon: Record<string, string> = {
  html: '🌐', vue: '💚', markdown: '📝',
  mermaid: '🔷', json: '{ }', csv: '📊', code: '💻',
}

const typeLabel: Record<string, string> = {
  html: 'HTML', vue: 'Vue SFC', markdown: 'Markdown',
  mermaid: 'Diagram', json: 'JSON', csv: 'CSV', code: 'Code',
}
</script>

<template>
  <div
    :class="[
      'ac-artifact border border-[var(--ac-border,#e5e7eb)] rounded-xl overflow-hidden bg-white',
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'w-full',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 px-3 py-2 bg-[var(--ac-surface,#f9fafb)] border-b border-[var(--ac-border,#e5e7eb)]">
      <span class="text-sm">{{ typeIcon[artifact.type] ?? '📄' }}</span>
      <div>
        <p class="text-xs font-semibold text-[var(--ac-text,#1f2937)] leading-tight">{{ artifact.title }}</p>
        <p class="text-[10px] text-[var(--ac-muted,#9ca3af)]">{{ typeLabel[artifact.type] }} · v{{ artifact.version }}</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 ml-auto">
        <button
          v-for="tab in ['preview', 'source']" :key="tab"
          @click="activeTab = tab as 'preview' | 'source'"
          :class="['px-2 py-1 text-[10px] rounded-md transition-colors', activeTab === tab ? 'bg-[var(--ac-primary,#6366f1)] text-white' : 'text-[var(--ac-muted,#6b7280)] hover:bg-[var(--ac-hover,#f3f4f6)]']"
        >
          {{ tab === 'preview' ? '👁 Preview' : '&lt;/&gt; Source' }}
        </button>
      </div>

      <!-- Fullscreen -->
      <button
        @click="isFullscreen = !isFullscreen"
        class="p-1 rounded hover:bg-[var(--ac-hover,#f3f4f6)] text-[var(--ac-muted,#9ca3af)] transition-colors"
        :title="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!isFullscreen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Content area -->
    <div class="relative" :style="isFullscreen ? 'height: calc(100% - 44px)' : 'max-height: 400px; height: 300px'">
      <!-- Preview -->
      <div v-if="activeTab === 'preview'" class="w-full h-full">
        <!-- HTML: iframe sandbox -->
        <iframe
          v-if="artifact.type === 'html' && previewSrc"
          :src="previewSrc"
          sandbox="allow-scripts allow-same-origin"
          class="w-full h-full border-0"
        />
        <!-- Markdown: rendered -->
        <div
          v-else-if="artifact.type === 'markdown'"
          class="p-4 h-full overflow-y-auto prose prose-sm max-w-none text-[var(--ac-text,#1f2937)]"
          v-html="artifact.content"
        />
        <!-- JSON: pretty table -->
        <div v-else-if="artifact.type === 'json'" class="p-4 h-full overflow-auto">
          <pre class="text-xs font-mono text-[var(--ac-text,#374151)]">{{ JSON.stringify(JSON.parse(artifact.content || '{}'), null, 2) }}</pre>
        </div>
        <!-- Code: syntax display -->
        <div v-else class="p-4 h-full overflow-auto bg-[#1e1e2e]">
          <pre class="text-xs font-mono text-[#cdd6f4] leading-relaxed">{{ artifact.content }}</pre>
        </div>
      </div>

      <!-- Source editor -->
      <div v-else class="w-full h-full overflow-auto bg-[#1e1e2e]">
        <pre class="p-4 text-xs font-mono text-[#cdd6f4] leading-relaxed">{{ artifact.content }}</pre>
      </div>
    </div>

    <!-- Version history footer -->
    <div v-if="artifact.history.length" class="px-3 py-1.5 border-t border-[var(--ac-border,#e5e7eb)] bg-[var(--ac-surface,#f9fafb)]">
      <div class="flex items-center gap-2 overflow-x-auto">
        <span class="text-[10px] text-[var(--ac-muted,#9ca3af)] flex-shrink-0">History:</span>
        <button
          v-for="snap in artifact.history" :key="snap.version"
          class="flex-shrink-0 px-2 py-0.5 text-[10px] rounded border border-[var(--ac-border,#e5e7eb)] hover:border-[var(--ac-primary,#6366f1)] text-[var(--ac-muted,#6b7280)] transition-colors"
        >
          v{{ snap.version }}
        </button>
      </div>
    </div>
  </div>

  <!-- Fullscreen backdrop -->
  <div v-if="isFullscreen" @click="isFullscreen = false" class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
</template>
