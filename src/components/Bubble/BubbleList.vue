<!-- BubbleList.vue -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Message } from '../../types'
import Bubble from './Bubble.vue'

const props = defineProps<{
  messages: Message[]
  isGenerating?: boolean
  enableMarkdown?: boolean
  virtual?: boolean
  virtualThreshold?: number
  estimatedItemHeight?: number
  virtualBuffer?: number
  onRetry?: (id: string) => void
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
}>()

const listRef = ref<HTMLDivElement | null>(null)
const isUserScrolled = ref(false)
const showScrollBtn = ref(false)
const scrollTop = ref(0)
const viewportHeight = ref(0)
const itemHeights = ref(new Map<string, number>())

let resizeObserver: ResizeObserver | null = null

const virtualThreshold = computed(() => props.virtualThreshold ?? 80)
const estimatedItemHeight = computed(() => props.estimatedItemHeight ?? 96)
const virtualBuffer = computed(() => props.virtualBuffer ?? 6)
const shouldVirtualize = computed(() => props.virtual !== false && props.messages.length > virtualThreshold.value)

const itemOffsets = computed(() => {
  const offsets = [0]
  let cursor = 0

  for (const message of props.messages) {
    cursor += itemHeights.value.get(message.id) ?? estimatedItemHeight.value
    offsets.push(cursor)
  }

  return offsets
})

const totalHeight = computed(() => itemOffsets.value[props.messages.length] ?? 0)

const visibleRange = computed(() => {
  if (!shouldVirtualize.value) {
    return { start: 0, end: props.messages.length }
  }

  const start = findOffsetIndex(Math.max(0, scrollTop.value - estimatedItemHeight.value * virtualBuffer.value))
  const end = findOffsetIndex(scrollTop.value + viewportHeight.value + estimatedItemHeight.value * virtualBuffer.value) + 1

  return {
    start: Math.max(0, start),
    end: Math.min(props.messages.length, end),
  }
})

const visibleMessages = computed(() =>
  props.messages.slice(visibleRange.value.start, visibleRange.value.end)
)

const offsetY = computed(() => itemOffsets.value[visibleRange.value.start] ?? 0)

function findOffsetIndex(offset: number) {
  const offsets = itemOffsets.value
  let low = 0
  let high = offsets.length - 1

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2)
    if (offsets[mid] <= offset) low = mid
    else high = mid - 1
  }

  return low
}

function updateViewport() {
  const el = listRef.value
  if (!el) return
  viewportHeight.value = el.clientHeight
  scrollTop.value = el.scrollTop
}

function measureRenderedItems() {
  const el = listRef.value
  if (!el || !shouldVirtualize.value) return

  const nextHeights = new Map(itemHeights.value)
  const renderedItems = el.querySelectorAll<HTMLElement>('[data-message-id]')

  for (const item of renderedItems) {
    const id = item.dataset.messageId
    if (!id) continue
    const height = item.offsetHeight
    if (height > 0 && nextHeights.get(id) !== height) {
      nextHeights.set(id, height)
    }
  }

  itemHeights.value = nextHeights
}

function scrollToBottom(smooth = true) {
  const el = listRef.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'instant' })
  showScrollBtn.value = false
}

function onScroll() {
  const el = listRef.value
  if (!el) return
  scrollTop.value = el.scrollTop
  viewportHeight.value = el.clientHeight
  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  isUserScrolled.value = !atBottom
  showScrollBtn.value = !atBottom
}

onMounted(() => {
  updateViewport()
  if (typeof ResizeObserver !== 'undefined' && listRef.value) {
    resizeObserver = new ResizeObserver(updateViewport)
    resizeObserver.observe(listRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(() => props.messages.length, async () => {
  const messageIds = new Set(props.messages.map(message => message.id))
  itemHeights.value = new Map([...itemHeights.value].filter(([id]) => messageIds.has(id)))
  await nextTick()
  updateViewport()
  measureRenderedItems()
  if (!isUserScrolled.value) scrollToBottom()
})

watch(
  () => props.messages[props.messages.length - 1]?.content,
  async () => {
    await nextTick()
    measureRenderedItems()
    if (!isUserScrolled.value) scrollToBottom(false)
  }
)

watch(visibleMessages, async () => {
  await nextTick()
  measureRenderedItems()
})
</script>

<template>
  <div class="ac-bubble-list relative flex-1 overflow-hidden">
    <div
      ref="listRef"
      role="log"
      aria-label="会话消息"
      aria-live="polite"
      aria-relevant="additions"
      @scroll="onScroll"
      class="h-full overflow-y-auto scroll-smooth"
    >
      <div v-if="shouldVirtualize" class="max-w-3xl mx-auto py-4">
        <div class="relative" :style="{ height: `${totalHeight}px` }">
          <div class="absolute inset-x-0 top-0" :style="{ transform: `translateY(${offsetY}px)` }">
            <div
              v-for="msg in visibleMessages"
              :key="msg.id"
              :data-message-id="msg.id"
            >
              <Bubble
                :message="msg"
                :enable-markdown="enableMarkdown"
                :on-retry="() => onRetry?.(msg.id)"
                :on-edit="content => onEdit?.(msg.id, content)"
                :on-delete="() => onDelete?.(msg.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="max-w-3xl mx-auto py-4">
        <Bubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          :enable-markdown="enableMarkdown"
          :on-retry="() => onRetry?.(msg.id)"
          :on-edit="content => onEdit?.(msg.id, content)"
          :on-delete="() => onDelete?.(msg.id)"
        />
      </div>
    </div>

    <Transition name="fade">
      <button
        v-if="showScrollBtn"
        @click="scrollToBottom()"
        class="absolute bottom-4 right-4 p-2 bg-white shadow-lg border border-[var(--ac-border,#e5e7eb)] rounded-full hover:bg-[var(--ac-hover,#f3f4f6)] transition-colors"
      >
        <svg class="w-4 h-4 text-[var(--ac-muted,#6b7280)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
