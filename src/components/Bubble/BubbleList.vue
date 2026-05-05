<!-- BubbleList.vue -->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Message } from '../../types'
import Bubble from './Bubble.vue'

const props = defineProps<{
  messages: Message[]
  isGenerating?: boolean
  enableMarkdown?: boolean
  onRetry?: (id: string) => void
  onDelete?: (id: string) => void
}>()

const listRef = ref<HTMLDivElement | null>(null)
const isUserScrolled = ref(false)
const showScrollBtn = ref(false)

function scrollToBottom(smooth = true) {
  const el = listRef.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'instant' })
  showScrollBtn.value = false
}

function onScroll() {
  const el = listRef.value
  if (!el) return
  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  isUserScrolled.value = !atBottom
  showScrollBtn.value = !atBottom
}

watch(() => props.messages.length, async () => {
  await nextTick()
  if (!isUserScrolled.value) scrollToBottom()
})

// Auto-scroll during streaming
watch(
  () => props.messages[props.messages.length - 1]?.content,
  async () => {
    await nextTick()
    if (!isUserScrolled.value) scrollToBottom(false)
  }
)
</script>

<template>
  <div class="ac-bubble-list relative flex-1 overflow-hidden">
    <div
      ref="listRef"
      @scroll="onScroll"
      class="h-full overflow-y-auto scroll-smooth"
    >
      <div class="max-w-3xl mx-auto py-4">
        <Bubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          :enable-markdown="enableMarkdown"
          :on-retry="() => onRetry?.(msg.id)"
          :on-delete="() => onDelete?.(msg.id)"
        />
      </div>
    </div>

    <!-- Scroll to bottom button -->
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
