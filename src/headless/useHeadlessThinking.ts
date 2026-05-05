/**
 * useHeadlessThinking
 * Collapsible reasoning panel logic. Zero styling.
 */
import { ref, computed, readonly, type Ref } from 'vue'
import type { ThinkingStep } from '../types'

export interface UseHeadlessThinkingOptions {
  steps: Ref<ThinkingStep[]> | ThinkingStep[]
  defaultExpanded?: boolean
}

export interface UseHeadlessThinkingReturn {
  isExpanded: Readonly<Ref<boolean>>
  isComplete: ReturnType<typeof computed<boolean>>
  toggle: () => void
  expand: () => void
  collapse: () => void
  fullText: ReturnType<typeof computed<string>>
  stepCount: ReturnType<typeof computed<number>>
  toggleAttrs: Record<string, string>
  panelAttrs: Record<string, string | boolean>
}

export function useHeadlessThinking(options: UseHeadlessThinkingOptions): UseHeadlessThinkingReturn {
  const { defaultExpanded = false } = options
  const stepsRef = Array.isArray(options.steps) ? ref(options.steps) : options.steps

  const isExpanded = ref(defaultExpanded)

  const isComplete = computed(() =>
    stepsRef.value.length > 0 && stepsRef.value[stepsRef.value.length - 1].isComplete
  )
  const fullText = computed(() => stepsRef.value.map(s => s.content).join('\n'))
  const stepCount = computed(() => stepsRef.value.length)

  function toggle() { isExpanded.value = !isExpanded.value }
  function expand() { isExpanded.value = true }
  function collapse() { isExpanded.value = false }

  const toggleAttrs: Record<string, string> = {
    type: 'button',
    'aria-expanded': String(isExpanded.value),
    'aria-controls': 'thinking-panel',
    'aria-label': isComplete.value ? 'Reasoning (completed)' : 'Reasoning (in progress)',
  }

  const panelAttrs: Record<string, string | boolean> = {
    id: 'thinking-panel',
    role: 'region',
    'aria-label': 'Model reasoning',
    hidden: !isExpanded.value,
  }

  return {
    isExpanded: readonly(isExpanded),
    isComplete,
    toggle, expand, collapse,
    fullText, stepCount,
    toggleAttrs, panelAttrs,
  }
}


// ─────────────────────────────────────────────────────────────────────────────

/**
 * useHeadlessToolCall
 * Tool call card expand/collapse + status helpers. Zero styling.
 */
import type { ToolCall } from '../types'

export interface UseHeadlessToolCallOptions {
  toolCall: ToolCall
  defaultExpanded?: boolean
}

export interface UseHeadlessToolCallReturn {
  isExpanded: Readonly<Ref<boolean>>
  toggle: () => void
  // Derived status helpers (use these to conditionally render icons/classes)
  isPending: boolean
  isRunning: boolean
  isSuccess: boolean
  isError: boolean
  statusLabel: string
  // Formatted arg/result strings
  formattedArgs: string
  formattedResult: string
  formattedError: string
  durationLabel: string | null
  // ARIA
  toggleAttrs: Record<string, string>
  panelAttrs: Record<string, string | boolean>
}

export function useHeadlessToolCall(options: UseHeadlessToolCallOptions): UseHeadlessToolCallReturn {
  const { toolCall, defaultExpanded = false } = options
  const isExpanded = ref(defaultExpanded)

  const toggle = () => { isExpanded.value = !isExpanded.value }

  const isPending = toolCall.status === 'pending'
  const isRunning = toolCall.status === 'running'
  const isSuccess = toolCall.status === 'success'
  const isError   = toolCall.status === 'error'

  const statusLabel = { pending: 'Pending', running: 'Running', success: 'Success', error: 'Error' }[toolCall.status]

  const formattedArgs = Object.keys(toolCall.arguments).length
    ? JSON.stringify(toolCall.arguments, null, 2)
    : '(no arguments)'

  const formattedResult = toolCall.result !== undefined
    ? (typeof toolCall.result === 'string' ? toolCall.result : JSON.stringify(toolCall.result, null, 2))
    : ''

  const formattedError = toolCall.error ?? ''

  const durationLabel = toolCall.durationMs != null
    ? toolCall.durationMs < 1000
      ? `${toolCall.durationMs}ms`
      : `${(toolCall.durationMs / 1000).toFixed(2)}s`
    : null

  const toggleAttrs: Record<string, string> = {
    type: 'button',
    'aria-expanded': String(isExpanded.value),
    'aria-controls': `tool-panel-${toolCall.id}`,
    'aria-label': `Tool call: ${toolCall.name}, status: ${statusLabel}`,
  }

  const panelAttrs: Record<string, string | boolean> = {
    id: `tool-panel-${toolCall.id}`,
    role: 'region',
    'aria-label': `Tool call result for ${toolCall.name}`,
    hidden: !isExpanded.value,
  }

  return {
    isExpanded: readonly(isExpanded),
    toggle,
    isPending, isRunning, isSuccess, isError,
    statusLabel,
    formattedArgs, formattedResult, formattedError,
    durationLabel,
    toggleAttrs, panelAttrs,
  }
}


// ─────────────────────────────────────────────────────────────────────────────

/**
 * useHeadlessArtifact
 * Artifact panel: tab switching, fullscreen, version history, blob URL management.
 * Zero styling.
 */
import type { Artifact, ArtifactType } from '../types'

export interface UseHeadlessArtifactOptions {
  artifact: Artifact
  onUpdate?: (content: string) => void
}

export type ArtifactTab = 'preview' | 'source'

export interface UseHeadlessArtifactReturn {
  // Tab state
  activeTab: Ref<ArtifactTab>
  setTab: (tab: ArtifactTab) => void
  isPreview: ReturnType<typeof computed<boolean>>
  isSource: ReturnType<typeof computed<boolean>>

  // Fullscreen
  isFullscreen: Readonly<Ref<boolean>>
  toggleFullscreen: () => void
  enterFullscreen: () => void
  exitFullscreen: () => void

  // Content
  blobUrl: ReturnType<typeof computed<string | null>>
  language: ReturnType<typeof computed<string>>
  typeLabel: ReturnType<typeof computed<string>>
  canPreview: ReturnType<typeof computed<boolean>>
  hasHistory: ReturnType<typeof computed<boolean>>

  // Actions
  updateContent: (content: string) => void
  restoreVersion: (version: number) => void
  copySource: () => Promise<void>
  hasCopied: Readonly<Ref<boolean>>

  // ARIA
  tabListAttrs: Record<string, string>
  getTabAttrs: (tab: ArtifactTab) => Record<string, string | boolean>
  getPanelAttrs: (tab: ArtifactTab) => Record<string, string | boolean>
  fullscreenButtonAttrs: ReturnType<typeof computed<Record<string, string>>>
  iframeAttrs: Record<string, string>
}

export function useHeadlessArtifact(options: UseHeadlessArtifactOptions): UseHeadlessArtifactReturn {
  const { artifact, onUpdate } = options

  const activeTab = ref<ArtifactTab>('preview')
  const isFullscreen = ref(false)
  const hasCopied = ref(false)

  const setTab = (tab: ArtifactTab) => { activeTab.value = tab }
  const isPreview = computed(() => activeTab.value === 'preview')
  const isSource  = computed(() => activeTab.value === 'source')

  const toggleFullscreen = () => { isFullscreen.value = !isFullscreen.value }
  const enterFullscreen  = () => { isFullscreen.value = true }
  const exitFullscreen   = () => { isFullscreen.value = false }

  // Manage blob URL lifecycle
  let _blobUrl: string | null = null
  const blobUrl = computed<string | null>(() => {
    if (artifact.type !== 'html') return null
    if (_blobUrl) URL.revokeObjectURL(_blobUrl)
    _blobUrl = URL.createObjectURL(new Blob([artifact.content], { type: 'text/html' }))
    return _blobUrl
  })

  const langMap: Record<ArtifactType, string> = {
    html: 'html', vue: 'vue', markdown: 'markdown',
    mermaid: 'text', json: 'json', csv: 'text', code: artifact.language ?? 'text',
  }
  const labelMap: Record<ArtifactType, string> = {
    html: 'HTML', vue: 'Vue SFC', markdown: 'Markdown',
    mermaid: 'Diagram', json: 'JSON', csv: 'CSV', code: 'Code',
  }

  const language  = computed(() => langMap[artifact.type])
  const typeLabel = computed(() => labelMap[artifact.type])
  const canPreview = computed(() => ['html', 'markdown', 'json'].includes(artifact.type))
  const hasHistory = computed(() => artifact.history.length > 0)

  function updateContent(content: string) {
    artifact.history.push({ version: artifact.version, content: artifact.content, timestamp: Date.now() })
    artifact.version++
    artifact.content = content
    onUpdate?.(content)
  }

  function restoreVersion(version: number) {
    const snap = artifact.history.find(h => h.version === version)
    if (snap) updateContent(snap.content)
  }

  async function copySource() {
    await navigator.clipboard.writeText(artifact.content).catch(() => {})
    hasCopied.value = true
    setTimeout(() => { hasCopied.value = false }, 2000)
  }

  // ARIA
  const tabListAttrs: Record<string, string> = {
    role: 'tablist',
    'aria-label': 'Artifact view tabs',
  }

  function getTabAttrs(tab: ArtifactTab): Record<string, string | boolean> {
    const active = activeTab.value === tab
    return {
      role: 'tab',
      'aria-selected': active,
      'aria-controls': `artifact-panel-${tab}`,
      id: `artifact-tab-${tab}`,
      tabindex: active ? '0' : '-1',
      type: 'button',
    }
  }

  function getPanelAttrs(tab: ArtifactTab): Record<string, string | boolean> {
    return {
      role: 'tabpanel',
      id: `artifact-panel-${tab}`,
      'aria-labelledby': `artifact-tab-${tab}`,
      hidden: activeTab.value !== tab,
    }
  }

  const fullscreenButtonAttrs = computed<Record<string, string>>(() => ({
    type: 'button',
    'aria-label': isFullscreen.value ? 'Exit fullscreen' : 'Enter fullscreen',
    'aria-pressed': String(isFullscreen.value),
  }))

  const iframeAttrs: Record<string, string> = {
    sandbox: 'allow-scripts allow-same-origin',
    title: artifact.title,
    loading: 'lazy',
  }

  return {
    activeTab,
    setTab, isPreview, isSource,
    isFullscreen: readonly(isFullscreen),
    toggleFullscreen, enterFullscreen, exitFullscreen,
    blobUrl, language, typeLabel, canPreview, hasHistory,
    updateContent, restoreVersion,
    copySource, hasCopied: readonly(hasCopied),
    tabListAttrs, getTabAttrs, getPanelAttrs,
    fullscreenButtonAttrs, iframeAttrs,
  }
}


// ─────────────────────────────────────────────────────────────────────────────

/**
 * useHeadlessWelcome
 * Welcome screen state: prompt card selection, suggestion clicks.
 * Zero styling.
 */
export interface PromptCard {
  icon?: string
  title: string
  prompt: string
  category?: string
}

export interface UseHeadlessWelcomeOptions {
  promptCards?: PromptCard[]
  suggestions?: string[]
  onSelect: (prompt: string) => void
}

export interface UseHeadlessWelcomeReturn {
  promptCards: PromptCard[]
  suggestions: string[]
  selectCard: (card: PromptCard) => void
  selectSuggestion: (text: string) => void
  getCardAttrs: (card: PromptCard) => Record<string, string>
  getSuggestionAttrs: (text: string) => Record<string, string>
  rootAttrs: Record<string, string>
}

export function useHeadlessWelcome(options: UseHeadlessWelcomeOptions): UseHeadlessWelcomeReturn {
  const { promptCards = [], suggestions = [], onSelect } = options

  const selectCard = (card: PromptCard) => onSelect(card.prompt)
  const selectSuggestion = (text: string) => onSelect(text)

  function getCardAttrs(card: PromptCard): Record<string, string> {
    return {
      type: 'button',
      role: 'button',
      'aria-label': `Use prompt: ${card.title}`,
      tabindex: '0',
    }
  }

  function getSuggestionAttrs(text: string): Record<string, string> {
    return {
      type: 'button',
      'aria-label': `Suggested question: ${text}`,
    }
  }

  const rootAttrs: Record<string, string> = {
    role: 'main',
    'aria-label': 'Welcome screen',
  }

  return {
    promptCards,
    suggestions,
    selectCard,
    selectSuggestion,
    getCardAttrs,
    getSuggestionAttrs,
    rootAttrs,
  }
}


// ─────────────────────────────────────────────────────────────────────────────

/**
 * useHeadlessCodeBlock
 * Code block copy, collapse, line-number, run-button state. Zero styling.
 */
export interface UseHeadlessCodeBlockOptions {
  code: string
  language?: string
  filename?: string
  collapsible?: boolean
  onRun?: (code: string) => void
}

export interface UseHeadlessCodeBlockReturn {
  isCollapsed: Readonly<Ref<boolean>>
  hasCopied: Readonly<Ref<boolean>>
  toggle: () => void
  copy: () => Promise<void>
  run: () => void
  lines: ReturnType<typeof computed<string[]>>
  lineCount: ReturnType<typeof computed<number>>
  language: string
  filename: string | undefined
  // ARIA
  toggleAttrs: ReturnType<typeof computed<Record<string, string>>>
  copyButtonAttrs: ReturnType<typeof computed<Record<string, string>>>
  runButtonAttrs: Record<string, string>
  preAttrs: Record<string, string>
}

export function useHeadlessCodeBlock(options: UseHeadlessCodeBlockOptions): UseHeadlessCodeBlockReturn {
  const { code, language = 'text', filename, collapsible = false, onRun } = options

  const isCollapsed = ref(false)
  const hasCopied = ref(false)

  const toggle = () => { if (collapsible) isCollapsed.value = !isCollapsed.value }

  async function copy() {
    await navigator.clipboard.writeText(code).catch(() => {})
    hasCopied.value = true
    setTimeout(() => { hasCopied.value = false }, 2000)
  }

  function run() { onRun?.(code) }

  const lines = computed(() => code.split('\n'))
  const lineCount = computed(() => lines.value.length)

  const toggleAttrs = computed<Record<string, string>>(() => ({
    type: 'button',
    'aria-expanded': String(!isCollapsed.value),
    'aria-label': isCollapsed.value ? 'Expand code' : 'Collapse code',
  }))

  const copyButtonAttrs = computed<Record<string, string>>(() => ({
    type: 'button',
    'aria-label': hasCopied.value ? 'Copied!' : 'Copy code',
    'aria-pressed': String(hasCopied.value),
  }))

  const runButtonAttrs: Record<string, string> = {
    type: 'button',
    'aria-label': `Run ${language} code`,
  }

  const preAttrs: Record<string, string> = {
    role: 'region',
    'aria-label': `${filename ?? language} code block`,
    tabindex: '0',
  }

  return {
    isCollapsed: readonly(isCollapsed),
    hasCopied: readonly(hasCopied),
    toggle, copy, run,
    lines, lineCount,
    language, filename,
    toggleAttrs, copyButtonAttrs, runButtonAttrs, preAttrs,
  }
}
