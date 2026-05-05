/**
 * useHeadlessBubbleList
 *
 * Manages scroll state for the message list:
 * - auto-scroll to bottom during streaming
 * - user-scroll detection (pause auto-scroll)
 * - scroll-to-bottom button visibility
 * - scroll position restoration on conversation switch
 * Zero styling.
 */
import { ref, watch, nextTick, readonly, type Ref } from 'vue'
import type { Message } from '../types'

export interface UseHeadlessBubbleListOptions {
  messages: Ref<Message[]>
  /** px from bottom considered "at bottom". Default: 80 */
  bottomThreshold?: number
}

export interface UseHeadlessBubbleListReturn {
  // Refs to bind to your container element
  listRef: Ref<HTMLElement | null>

  // State
  isAtBottom: Readonly<Ref<boolean>>
  showScrollButton: Readonly<Ref<boolean>>
  isUserScrolled: Readonly<Ref<boolean>>

  // Actions
  scrollToBottom: (behavior?: ScrollBehavior) => void
  resumeAutoScroll: () => void

  // Event handler — bind to your container's scroll event
  onScroll: () => void

  // ARIA attr object
  listAttrs: {
    role: string
    'aria-label': string
    'aria-live': string
    'aria-relevant': string
  }

  scrollButtonAttrs: {
    type: 'button'
    'aria-label': string
    title: string
  }
}

export function useHeadlessBubbleList(
  options: UseHeadlessBubbleListOptions
): UseHeadlessBubbleListReturn {
  const { messages, bottomThreshold = 80 } = options

  const listRef = ref<HTMLElement | null>(null)
  const isAtBottom = ref(true)
  const showScrollButton = ref(false)
  const isUserScrolled = ref(false)

  function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    const el = listRef.value
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
    isAtBottom.value = true
    showScrollButton.value = false
    isUserScrolled.value = false
  }

  function onScroll() {
    const el = listRef.value
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    const atBottom = distFromBottom < bottomThreshold
    isAtBottom.value = atBottom
    showScrollButton.value = !atBottom
    // Mark as user-scrolled only when scrolling UP
    if (!atBottom) isUserScrolled.value = true
  }

  function resumeAutoScroll() {
    isUserScrolled.value = false
    scrollToBottom()
  }

  // Auto-scroll when new messages arrive (respect user scroll position)
  watch(
    () => messages.value.length,
    async () => {
      await nextTick()
      if (!isUserScrolled.value) scrollToBottom('instant')
    }
  )

  // Auto-scroll during streaming (content grows)
  let lastContent = ''
  watch(
    () => {
      const last = messages.value[messages.value.length - 1]
      return last?.content ?? ''
    },
    async (content) => {
      if (content === lastContent) return
      lastContent = content
      await nextTick()
      if (!isUserScrolled.value) scrollToBottom('instant')
    }
  )

  const listAttrs = {
    role: 'log',
    'aria-label': 'Conversation messages',
    'aria-live': 'polite',
    'aria-relevant': 'additions',
  }

  const scrollButtonAttrs = {
    type: 'button' as const,
    'aria-label': 'Scroll to bottom',
    title: 'Scroll to bottom',
  }

  return {
    listRef,
    isAtBottom: readonly(isAtBottom),
    showScrollButton: readonly(showScrollButton),
    isUserScrolled: readonly(isUserScrolled),
    scrollToBottom,
    resumeAutoScroll,
    onScroll,
    listAttrs,
    scrollButtonAttrs,
  }
}
