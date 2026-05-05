<script setup lang="ts">
import { ref, computed } from 'vue'
import AttachmentButton from './AttachmentButton.vue'

const props = withDefaults(defineProps<{
  disabled?: boolean
  isGenerating?: boolean
  placeholder?: string
  enableVoice?: boolean
  enableAttachments?: boolean
  suggestions?: string[]
  maxLength?: number
}>(), {
  placeholder: 'Message...',
  enableVoice: false,
  enableAttachments: false,
  maxLength: 32000,
})

const emit = defineEmits<{
  send: [content: string]
  stop: []
  attach: [files: FileList]
}>()

const input = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isRecording = ref(false)

const canSend = computed(() => input.value.trim().length > 0 && !props.disabled)

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 200) + 'px'
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function send() {
  if (!canSend.value && !props.isGenerating) return
  if (props.isGenerating) {
    emit('stop')
    return
  }
  const content = input.value.trim()
  if (!content) return
  emit('send', content)
  input.value = ''
  if (textareaRef.value) textareaRef.value.style.height = 'auto'
}

function handleSuggestion(s: string) {
  input.value = s
  textareaRef.value?.focus()
}

async function toggleVoice() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert('Voice input not supported in this browser')
    return
  }
  if (isRecording.value) {
    isRecording.value = false
    return
  }
  const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert('Voice input not supported in this browser')
    return
  }
  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.onresult = (e: AiChatSpeechRecognitionEvent) => {
    input.value = Array.from(e.results).map(r => r[0].transcript).join('')
  }
  recognition.onend = () => { isRecording.value = false }
  recognition.start()
  isRecording.value = true
}
</script>

<template>
  <div class="ac-sender flex flex-col gap-2 px-4 py-3 border-t border-[var(--ac-border,#e5e7eb)] bg-[var(--ac-surface,#ffffff)]">
    <!-- 建议问题放在输入区上方，避免用户输入过程中被重新布局打断。 -->
    <div v-if="suggestions?.length" class="flex flex-wrap gap-1.5">
      <button
        v-for="s in suggestions" :key="s"
        @click="handleSuggestion(s)"
        class="px-2.5 py-1 text-xs border border-[var(--ac-border,#e5e7eb)] rounded-full hover:border-[var(--ac-primary,#6366f1)] hover:text-[var(--ac-primary,#6366f1)] transition-colors text-[var(--ac-muted,#6b7280)]"
      >
        {{ s }}
      </button>
    </div>

    <!-- 输入行需要保持单一容器，确保聚焦样式和边框状态一致。 -->
    <div class="flex items-end gap-2 bg-[var(--ac-input-bg,#f9fafb)] border border-[var(--ac-border,#e5e7eb)] rounded-xl px-3 py-2 focus-within:border-[var(--ac-primary,#6366f1)] transition-colors">
      <!-- 附件入口只在启用时渲染，避免暴露未接入的交互。 -->
      <AttachmentButton v-if="enableAttachments" @attach="files => emit('attach', files)" />

      <!-- 文本域高度由输入内容驱动，减少短消息场景的视觉噪声。 -->
      <textarea
        ref="textareaRef"
        v-model="input"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        @input="autoResize"
        @keydown="handleKeydown"
        rows="1"
        class="flex-1 resize-none bg-transparent text-sm text-[var(--ac-text,#1f2937)] placeholder-[var(--ac-muted,#9ca3af)] outline-none leading-relaxed max-h-48"
        style="min-height: 24px"
      />

      <!-- 字数提示接近上限才显示，降低常规输入时的干扰。 -->
      <span
        v-if="input.length > maxLength * 0.8"
        class="text-[10px] text-[var(--ac-muted,#9ca3af)] self-end pb-0.5"
      >
        {{ input.length }}/{{ maxLength }}
      </span>

      <!-- 语音入口依赖浏览器能力，逻辑层会显式处理不支持场景。 -->
      <button
        v-if="enableVoice"
        @click="toggleVoice"
        :class="['p-1.5 rounded-lg transition-colors self-end', isRecording ? 'text-red-500 bg-red-50' : 'text-[var(--ac-muted,#9ca3af)] hover:text-[var(--ac-primary,#6366f1)]']"
        :title="isRecording ? 'Stop recording' : 'Voice input'"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2h2v2a5 5 0 0 0 10 0v-2h2z"/>
          <path d="M11 19h2v4h-2z"/>
        </svg>
      </button>

      <!-- 发送与停止共用位置，避免生成状态切换时按钮跳动。 -->
      <button
        @click="send"
        :class="[
          'flex-shrink-0 p-1.5 rounded-lg transition-all self-end',
          isGenerating
            ? 'bg-red-100 text-red-500 hover:bg-red-200'
            : canSend
              ? 'bg-[var(--ac-primary,#6366f1)] text-white hover:opacity-90 shadow-sm'
              : 'text-[var(--ac-muted,#d1d5db)] cursor-not-allowed',
        ]"
      >
        <!-- 停止态使用实心图形，便于和发送态形成明确区分。 -->
        <svg v-if="isGenerating" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2"/>
        </svg>
        <!-- 发送态保持轻量图形，避免输入区视觉权重过高。 -->
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 0l-7 7m7-7l7 7"/>
        </svg>
      </button>
    </div>

    <p class="text-center text-[10px] text-[var(--ac-muted,#9ca3af)]">
      <slot name="footer">AI can make mistakes. Verify important information.</slot>
    </p>
  </div>
</template>
