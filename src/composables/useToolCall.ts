// ============================================================
// useToolCall
// ============================================================
import { ref } from 'vue'
import type { ToolCall } from '../types'

export function useToolCall() {
  const expandedTools = ref<Set<string>>(new Set())

  function toggle(id: string) {
    if (expandedTools.value.has(id)) expandedTools.value.delete(id)
    else expandedTools.value.add(id)
  }

  function isExpanded(id: string) {
    return expandedTools.value.has(id)
  }

  function statusIcon(status: ToolCall['status']) {
    return {
      pending: '⏳',
      running: '⚙️',
      success: '✅',
      error: '❌',
    }[status]
  }

  function statusColor(status: ToolCall['status']) {
    return {
      pending: 'text-slate-400',
      running: 'text-blue-500',
      success: 'text-emerald-500',
      error: 'text-red-500',
    }[status]
  }

  return { expandedTools, toggle, isExpanded, statusIcon, statusColor }
}

// ============================================================
// useArtifact
// ============================================================
import type { Artifact, ArtifactType } from '../types'

export function useArtifact() {
  const activeArtifact = ref<Artifact | null>(null)
  const isFullscreen = ref(false)
  const activeTab = ref<'preview' | 'source'>('preview')

  function open(artifact: Artifact) {
    activeArtifact.value = artifact
  }

  function close() {
    activeArtifact.value = null
    isFullscreen.value = false
  }

  function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value
  }

  function updateContent(content: string) {
    if (!activeArtifact.value) return
    const art = activeArtifact.value
    art.history.push({ version: art.version, content: art.content, timestamp: Date.now() })
    art.version++
    art.content = content
  }

  function restoreVersion(version: number) {
    if (!activeArtifact.value) return
    const snap = activeArtifact.value.history.find(h => h.version === version)
    if (snap) {
      updateContent(snap.content)
    }
  }

  function getLanguage(type: ArtifactType, lang?: string): string {
    const map: Record<ArtifactType, string> = {
      html: 'html', vue: 'vue', markdown: 'markdown',
      mermaid: 'text', json: 'json', csv: 'text', code: lang ?? 'text',
    }
    return map[type]
  }

  return {
    activeArtifact,
    isFullscreen,
    activeTab,
    open,
    close,
    toggleFullscreen,
    updateContent,
    restoreVersion,
    getLanguage,
  }
}
