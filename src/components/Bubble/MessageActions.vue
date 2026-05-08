<!-- MessageActions.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Message } from '../../types'

const props = defineProps<{
  message: Message
  isUser?: boolean
}>()
const emit = defineEmits<{
  retry: []
  edit: [content: string]
  delete: []
  copy: []
}>()

const copied = ref(false)
const feedback = ref<'up' | 'down' | null>(null)

async function copy() {
  await navigator.clipboard.writeText(props.message.content)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
  emit('copy')
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="ac-message-actions flex items-center gap-1 mt-1 px-1">
    <span class="text-[10px] text-[var(--ac-muted,#9ca3af)] mr-1">{{ formatTime(message.timestamp) }}</span>

    <!-- Copy -->
    <button
      @click="copy"
      :title="copied ? 'Copied!' : 'Copy'"
      class="p-1 rounded hover:bg-[var(--ac-hover,#f3f4f6)] text-[var(--ac-muted,#9ca3af)] hover:text-[var(--ac-text,#374151)] transition-colors"
    >
      <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
      <svg v-else class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
    </button>

    <!-- Retry (assistant only) -->
    <button
      v-if="!isUser && !message.isStreaming"
      @click="emit('retry')"
      title="Retry"
      class="p-1 rounded hover:bg-[var(--ac-hover,#f3f4f6)] text-[var(--ac-muted,#9ca3af)] hover:text-[var(--ac-text,#374151)] transition-colors"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
    </button>

    <!-- Feedback (assistant only) -->
    <template v-if="!isUser">
      <button
        @click="feedback = feedback === 'up' ? null : 'up'"
        :class="['p-1 rounded transition-colors', feedback === 'up' ? 'text-emerald-500' : 'text-[var(--ac-muted,#9ca3af)] hover:text-[var(--ac-text,#374151)]']"
        title="Good response"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
        </svg>
      </button>
      <button
        @click="feedback = feedback === 'down' ? null : 'down'"
        :class="['p-1 rounded transition-colors', feedback === 'down' ? 'text-red-400' : 'text-[var(--ac-muted,#9ca3af)] hover:text-[var(--ac-text,#374151)]']"
        title="Bad response"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/>
        </svg>
      </button>
    </template>

    <button
      v-if="isUser && !message.isStreaming"
      @click="emit('edit', message.content)"
      title="Edit"
      class="p-1 rounded hover:bg-[var(--ac-hover,#f3f4f6)] text-[var(--ac-muted,#9ca3af)] hover:text-[var(--ac-text,#374151)] transition-colors"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>

    <!-- Delete -->
    <button
      @click="emit('delete')"
      title="Delete"
      class="p-1 rounded hover:bg-red-50 text-[var(--ac-muted,#9ca3af)] hover:text-red-400 transition-colors"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
    </button>
  </div>
</template>
