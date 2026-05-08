/**
 * useHeadlessBubble
 *
 * Handles all state/logic for a single message bubble.
 * Zero styling. Returns data + handlers + ARIA attrs to spread.
 *
 * @example
 * ```vue
 * <script setup>
 * const bubble = useHeadlessBubble({ message, onRetry, onDelete })
 * </script>
 * <template>
 *   <!-- Spread ARIA attrs directly -->
 *   <article v-bind="bubble.rootAttrs">
 *     <div v-if="bubble.isUser">...</div>
 *   </article>
 * </template>
 * ```
 */
import { ref, readonly } from 'vue'
import type { Message } from '../types'

export interface UseHeadlessBubbleOptions {
  message: Message
  onRetry?: () => void
  onDelete?: () => void
  onEdit?: (content: string) => void
  onCopy?: () => void
}

export interface UseHeadlessBubbleReturn {
  // State
  isUser: boolean
  isAssistant: boolean
  isTool: boolean
  isSystem: boolean
  isStreaming: boolean
  isError: boolean
  isEmpty: boolean
  hasCopied: Readonly<ReturnType<typeof ref<boolean>>>
  feedback: Readonly<ReturnType<typeof ref<'up' | 'down' | null>>>

  // Computed content
  displayContent: string
  formattedTime: string
  errorMessage: string | null

  // Actions
  copy: () => Promise<void>
  retry: () => void
  delete: () => void
  submitEdit: (content: string) => void
  setFeedback: (val: 'up' | 'down' | null) => void

  // ARIA / accessibility attr objects (spread with v-bind)
  rootAttrs: Record<string, string>
  copyButtonAttrs: Record<string, string>
  retryButtonAttrs: Record<string, string>
  deleteButtonAttrs: Record<string, string>
}

export function useHeadlessBubble(options: UseHeadlessBubbleOptions): UseHeadlessBubbleReturn {
  const { message, onRetry, onDelete, onEdit, onCopy } = options

  const hasCopied = ref(false)
  const feedback = ref<'up' | 'down' | null>(null)

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const isTool = message.role === 'tool'
  const isSystem = message.role === 'system'
  const isStreaming = message.isStreaming ?? false
  const isError = message.isError ?? false
  const isEmpty = !message.content && !isStreaming

  const displayContent = message.content ?? ''
  const errorMessage = message.errorMessage ?? null

  const formattedTime = (() => {
    const d = new Date(message.timestamp)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60_000) return 'just now'
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86_400_000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  })()

  async function copy() {
    try {
      await navigator.clipboard.writeText(displayContent)
      hasCopied.value = true
      onCopy?.()
      setTimeout(() => { hasCopied.value = false }, 2000)
    } catch { /* clipboard not available */ }
  }

  function retry() { onRetry?.() }
  function deleteMsg() { onDelete?.() }
  function submitEdit(content: string) { onEdit?.(content) }
  function setFeedback(val: 'up' | 'down' | null) { feedback.value = val }

  // ARIA attr objects — users spread these onto their own elements
  const rootAttrs: Record<string, string> = {
    role: 'article',
    'aria-label': `${message.role} message`,
    'data-role': message.role,
    'data-streaming': String(isStreaming),
    'data-error': String(isError),
  }

  const copyButtonAttrs: Record<string, string> = {
    type: 'button',
    'aria-label': hasCopied.value ? 'Copied!' : 'Copy message',
    'aria-pressed': String(hasCopied.value),
  }

  const retryButtonAttrs: Record<string, string> = {
    type: 'button',
    'aria-label': 'Retry message',
  }

  const deleteButtonAttrs: Record<string, string> = {
    type: 'button',
    'aria-label': 'Delete message',
    'aria-haspopup': 'dialog',
  }

  return {
    isUser,
    isAssistant,
    isTool,
    isSystem,
    isStreaming,
    isError,
    isEmpty,
    hasCopied: readonly(hasCopied),
    feedback: readonly(feedback),
    displayContent,
    formattedTime,
    errorMessage,
    copy,
    retry,
    delete: deleteMsg,
    submitEdit,
    setFeedback,
    rootAttrs,
    copyButtonAttrs,
    retryButtonAttrs,
    deleteButtonAttrs,
  }
}
