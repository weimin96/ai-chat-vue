<script setup lang="ts">
// Bubble.vue
import { computed } from 'vue'
import type { Message } from '../../types'
import MessageAvatar from './MessageAvatar.vue'
import MessageActions from './MessageActions.vue'
import MarkdownRenderer from '../Markdown/MarkdownRenderer.vue'
import Thinking from '../Thinking/Thinking.vue'
import ToolCallCard from '../ToolCall/ToolCallCard.vue'
import ArtifactPanel from '../Artifact/ArtifactPanel.vue'

const props = withDefaults(defineProps<{
  message: Message
  showAvatar?: boolean
  enableMarkdown?: boolean
  onRetry?: () => void
  onEdit?: (content: string) => void
  onDelete?: () => void
}>(), {
  showAvatar: true,
  enableMarkdown: true,
})

const isUser = computed(() => props.message.role === 'user')
const isAssistant = computed(() => props.message.role === 'assistant')
</script>

<template>
  <div
    :class="[
      'ac-bubble group flex gap-3 px-4 py-3',
      isUser ? 'flex-row-reverse' : 'flex-row',
    ]"
  >
    <MessageAvatar v-if="showAvatar" :role="message.role" />

    <div :class="['flex flex-col gap-1 max-w-[80%]', isUser ? 'items-end' : 'items-start']">
      <!-- Thinking -->
      <Thinking v-if="message.thinking?.length" :steps="message.thinking" />

      <!-- Tool Calls -->
      <ToolCallCard
        v-for="tc in message.toolCalls" :key="tc.id"
        :tool-call="tc"
        class="w-full"
      />

      <!-- Main content bubble -->
      <div
        :class="[
          'ac-bubble-content rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-[var(--ac-user-bg,#6366f1)] text-white rounded-tr-sm'
            : 'bg-[var(--ac-assistant-bg,#f3f4f6)] text-[var(--ac-text,#1f2937)] rounded-tl-sm',
          message.isError && 'border border-red-300 bg-red-50 text-red-700',
        ]"
      >
        <!-- Streaming cursor -->
        <span v-if="message.isStreaming && !message.content" class="inline-flex gap-1">
          <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay:0ms"/>
          <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay:150ms"/>
          <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay:300ms"/>
        </span>

        <!-- Error -->
        <div v-else-if="message.isError" class="flex items-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          {{ message.errorMessage ?? 'An error occurred' }}
        </div>

        <!-- Markdown or plain text -->
        <MarkdownRenderer
          v-else-if="enableMarkdown && isAssistant"
          :content="message.content"
          :is-streaming="message.isStreaming"
        />
        <span v-else class="whitespace-pre-wrap">{{ message.content }}</span>
      </div>

      <!-- Artifacts -->
      <ArtifactPanel
        v-for="art in message.artifacts" :key="art.id"
        :artifact="art"
        class="w-full mt-1"
      />

      <!-- Actions -->
      <MessageActions
        :message="message"
        :is-user="isUser"
        @retry="onRetry?.()"
        @edit="c => onEdit?.(c)"
        @delete="onDelete?.()"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  </div>
</template>
