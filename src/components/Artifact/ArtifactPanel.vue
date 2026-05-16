<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Artifact } from '../../types'
import MarkdownRenderer from '../Markdown/MarkdownRenderer.vue'

type ArtifactPanelTab = 'preview' | 'source'

const props = withDefaults(defineProps<{
  artifact: Artifact
  enableUnsafeHtmlPreview?: boolean
}>(), {
  enableUnsafeHtmlPreview: false,
})
const emit = defineEmits<{
  update: [content: string]
  'fullscreen-change': [value: boolean]
  'tab-change': [tab: ArtifactPanelTab]
  copy: [content: string]
}>()

const activeTab = ref<ArtifactPanelTab>('preview')
const isFullscreen = ref(false)
const previewSrc = ref<string | null>(null)
const previewError = ref<string | null>(null)
const copyError = ref<string | null>(null)

let currentUrl: string | null = null

const isHtmlPreviewEnabled = computed(() =>
  props.artifact.type === 'html' && props.enableUnsafeHtmlPreview
)
const canSelectPreview = computed(() =>
  props.artifact.type !== 'html' || props.enableUnsafeHtmlPreview
)

const jsonPreview = computed(() => {
  if (props.artifact.type !== 'json') return { ok: true, content: '' }

  try {
    return {
      ok: true,
      content: JSON.stringify(JSON.parse(props.artifact.content || '{}'), null, 2),
    }
  } catch (err: unknown) {
    return {
      ok: false,
      content: err instanceof Error ? err.message : 'JSON 解析失败',
    }
  }
})

const typeIcon: Record<string, string> = {
  html: 'HTML',
  vue: 'VUE',
  markdown: 'MD',
  mermaid: 'MMD',
  json: 'JSON',
  csv: 'CSV',
  code: 'CODE',
}

const typeLabel: Record<string, string> = {
  html: 'HTML',
  vue: 'Vue SFC',
  markdown: 'Markdown',
  mermaid: 'Diagram',
  json: 'JSON',
  csv: 'CSV',
  code: 'Code',
}

function revokePreviewUrl() {
  if (!currentUrl) return
  URL.revokeObjectURL(currentUrl)
  currentUrl = null
}

function refreshPreviewUrl() {
  revokePreviewUrl()
  previewSrc.value = null
  previewError.value = null

  if (!isHtmlPreviewEnabled.value) return

  if (typeof window === 'undefined' || !URL.createObjectURL) {
    previewError.value = '当前环境不支持 HTML 预览'
    return
  }

  try {
    currentUrl = URL.createObjectURL(
      new Blob([props.artifact.content], { type: 'text/html' })
    )
    previewSrc.value = currentUrl
  } catch (err: unknown) {
    previewError.value = err instanceof Error ? err.message : 'HTML 预览创建失败'
  }
}

watch(
  () => [
    props.artifact.id,
    props.artifact.type,
    props.artifact.content,
    props.enableUnsafeHtmlPreview,
  ] as const,
  () => {
    if (props.artifact.type === 'html' && !props.enableUnsafeHtmlPreview) {
      activeTab.value = 'source'
    }
    refreshPreviewUrl()
  },
  { immediate: true }
)

onBeforeUnmount(revokePreviewUrl)

function setTab(tab: ArtifactPanelTab) {
  if (tab === 'preview' && !canSelectPreview.value) return
  activeTab.value = tab
  emit('tab-change', tab)
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen-change', isFullscreen.value)
}

async function copyContent() {
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      throw new Error('当前环境不支持剪贴板')
    }
    await navigator.clipboard.writeText(props.artifact.content)
    copyError.value = null
    emit('copy', props.artifact.content)
  } catch (err: unknown) {
    copyError.value = err instanceof Error ? err.message : '复制失败'
  }
}
</script>

<template>
  <div
    :class="[
      'ac-artifact border border-[var(--ac-border,#e5e7eb)] rounded-xl overflow-hidden bg-white',
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'w-full',
    ]"
  >
    <div class="flex items-center gap-2 px-3 py-2 bg-[var(--ac-surface,#f9fafb)] border-b border-[var(--ac-border,#e5e7eb)]">
      <span class="text-[10px] font-semibold text-[var(--ac-muted,#6b7280)]">{{ typeIcon[artifact.type] ?? 'FILE' }}</span>
      <div>
        <p class="text-xs font-semibold text-[var(--ac-text,#1f2937)] leading-tight">{{ artifact.title }}</p>
        <p class="text-[10px] text-[var(--ac-muted,#9ca3af)]">{{ typeLabel[artifact.type] }} · v{{ artifact.version }}</p>
      </div>

      <div class="flex gap-1 ml-auto">
        <button
          v-for="tab in (['preview', 'source'] as ArtifactPanelTab[])"
          :key="tab"
          :disabled="tab === 'preview' && !canSelectPreview"
          :aria-selected="activeTab === tab"
          type="button"
          @click="setTab(tab)"
          :class="[
            'px-2 py-1 text-[10px] rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40',
            activeTab === tab
              ? 'bg-[var(--ac-primary,#4f46e5)] text-white'
              : 'text-[var(--ac-muted,#6b7280)] hover:bg-[var(--ac-hover,#f3f4f6)]',
          ]"
        >
          {{ tab === 'preview' ? '预览' : '源码' }}
        </button>
      </div>

      <button
        type="button"
        @click="copyContent"
        class="p-1 rounded hover:bg-[var(--ac-hover,#f3f4f6)] text-[var(--ac-muted,#9ca3af)] transition-colors"
        title="复制"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      </button>

      <button
        type="button"
        @click="toggleFullscreen"
        class="p-1 rounded hover:bg-[var(--ac-hover,#f3f4f6)] text-[var(--ac-muted,#9ca3af)] transition-colors"
        :title="isFullscreen ? '退出全屏' : '全屏'"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!isFullscreen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div
      v-if="copyError"
      class="px-3 py-1 text-[10px] text-red-600 bg-red-50 border-b border-red-100"
    >
      {{ copyError }}
    </div>

    <div class="relative" :style="isFullscreen ? 'height: calc(100% - 44px)' : 'max-height: 400px; height: 300px'">
      <div v-if="activeTab === 'preview'" class="w-full h-full">
        <iframe
          v-if="artifact.type === 'html' && previewSrc"
          :src="previewSrc"
          sandbox="allow-scripts"
          referrerpolicy="no-referrer"
          :title="artifact.title"
          class="w-full h-full border-0"
        />
        <div
          v-else-if="artifact.type === 'html' && previewError"
          class="p-4 h-full overflow-auto text-xs text-red-600"
        >
          {{ previewError }}
        </div>
        <MarkdownRenderer
          v-else-if="artifact.type === 'markdown'"
          :content="artifact.content"
          class="p-4 h-full overflow-y-auto text-[var(--ac-text,#1f2937)]"
        />
        <div v-else-if="artifact.type === 'json'" class="p-4 h-full overflow-auto">
          <pre v-if="jsonPreview.ok" class="text-xs font-mono text-[var(--ac-text,#374151)]">{{ jsonPreview.content }}</pre>
          <pre v-else class="text-xs font-mono text-red-600">{{ jsonPreview.content }}</pre>
        </div>
        <div v-else class="p-4 h-full overflow-auto bg-[#1e1e2e]">
          <pre class="text-xs font-mono text-[#cdd6f4] leading-relaxed">{{ artifact.content }}</pre>
        </div>
      </div>

      <div v-else class="w-full h-full overflow-auto bg-[#1e1e2e]">
        <pre class="p-4 text-xs font-mono text-[#cdd6f4] leading-relaxed">{{ artifact.content }}</pre>
      </div>
    </div>

    <div v-if="artifact.history.length" class="px-3 py-1.5 border-t border-[var(--ac-border,#e5e7eb)] bg-[var(--ac-surface,#f9fafb)]">
      <div class="flex items-center gap-2 overflow-x-auto">
        <span class="text-[10px] text-[var(--ac-muted,#9ca3af)] flex-shrink-0">历史</span>
        <button
          v-for="snap in artifact.history" :key="snap.version"
          type="button"
          class="flex-shrink-0 px-2 py-0.5 text-[10px] rounded border border-[var(--ac-border,#e5e7eb)] hover:border-[var(--ac-primary,#4f46e5)] text-[var(--ac-muted,#6b7280)] transition-colors"
        >
          v{{ snap.version }}
        </button>
      </div>
    </div>
  </div>

  <div v-if="isFullscreen" @click="toggleFullscreen" class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
</template>
