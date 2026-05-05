/**
 * useHeadlessSender
 *
 * All input logic: value binding, multiline resize, keyboard shortcuts,
 * character counting, file attachment, voice recording state.
 * Zero styling.
 *
 * @example
 * ```vue
 * <script setup>
 * const sender = useHeadlessSender({ onSend: chat.sendMessage, onStop: chat.stopGeneration })
 * </script>
 * <template>
 *   <textarea v-bind="sender.textareaAttrs" v-on="sender.textareaListeners" />
 *   <button v-bind="sender.sendButtonAttrs" @click="sender.submit">Send</button>
 * </template>
 * ```
 */
import { ref, computed, readonly } from 'vue'

export interface UseHeadlessSenderOptions {
  onSend: (content: string) => void | Promise<void>
  onStop?: () => void
  onAttach?: (files: FileList) => void
  isGenerating?: boolean
  maxLength?: number
  placeholder?: string
}

export interface UseHeadlessSenderReturn {
  // State
  value: ReturnType<typeof ref<string>>
  isRecording: Readonly<ReturnType<typeof ref<boolean>>>
  charCount: ReturnType<typeof computed<number>>
  remainingChars: ReturnType<typeof computed<number>>
  isOverLimit: ReturnType<typeof computed<boolean>>
  canSubmit: ReturnType<typeof computed<boolean>>
  isNearLimit: ReturnType<typeof computed<boolean>>

  // Actions
  submit: () => void
  clear: () => void
  insertText: (text: string) => void
  startVoice: () => Promise<void>
  stopVoice: () => void
  handleFiles: (files: FileList) => void

  // Event handlers (spread with v-on)
  textareaListeners: {
    input: (e: Event) => void
    keydown: (e: KeyboardEvent) => void
    paste: (e: ClipboardEvent) => void
  }

  // Attr objects (spread with v-bind)
  textareaAttrs: {
    placeholder: string
    maxlength: number
    rows: number
    'aria-label': string
    'aria-multiline': string
    'aria-describedby': string
  }
  sendButtonAttrs: {
    type: 'button'
    'aria-label': string
    disabled: boolean
  }
  stopButtonAttrs: {
    type: 'button'
    'aria-label': string
  }
  voiceButtonAttrs: {
    type: 'button'
    'aria-label': string
    'aria-pressed': string
  }
  fileInputAttrs: {
    type: 'file'
    multiple: boolean
    'aria-label': string
  }

  // Internal ref for the textarea element (for focus/resize)
  textareaRef: ReturnType<typeof ref<HTMLTextAreaElement | null>>
}

export function useHeadlessSender(options: UseHeadlessSenderOptions): UseHeadlessSenderReturn {
  const {
    onSend,
    onStop,
    onAttach,
    isGenerating = false,
    maxLength = 32_000,
    placeholder = 'Message…',
  } = options

  const value = ref('')
  const isRecording = ref(false)
  const textareaRef = ref<HTMLTextAreaElement | null>(null)

  let recognition: SpeechRecognition | null = null

  const charCount = computed(() => value.value.length)
  const remainingChars = computed(() => maxLength - charCount.value)
  const isOverLimit = computed(() => charCount.value > maxLength)
  const isNearLimit = computed(() => charCount.value > maxLength * 0.8)
  const canSubmit = computed(() => value.value.trim().length > 0 && !isOverLimit.value && !isGenerating)

  // Auto-resize textarea helper (consumers call this after ref is bound)
  function autoResize() {
    const el = textareaRef.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 240) + 'px'
  }

  function submit() {
    if (isGenerating) { onStop?.(); return }
    if (!canSubmit.value) return
    onSend(value.value.trim())
    clear()
  }

  function clear() {
    value.value = ''
    if (textareaRef.value) textareaRef.value.style.height = 'auto'
  }

  function insertText(text: string) {
    const el = textareaRef.value
    if (el) {
      const start = el.selectionStart ?? value.value.length
      const end = el.selectionEnd ?? value.value.length
      value.value = value.value.slice(0, start) + text + value.value.slice(end)
      // Restore cursor
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + text.length
        autoResize()
      })
    } else {
      value.value += text
    }
  }

  async function startVoice() {
    const SR = (window as unknown as Record<string, unknown>)['SpeechRecognition'] as (new() => SpeechRecognition) | undefined
               ?? (window as unknown as Record<string, unknown>)['webkitSpeechRecognition'] as (new() => SpeechRecognition) | undefined
    if (!SR) throw new Error('SpeechRecognition not supported')

    recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'zh-CN'

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      value.value = Array.from(e.results).map(r => r[0].transcript).join('')
    }
    recognition.onend = () => { isRecording.value = false }
    recognition.onerror = () => { isRecording.value = false }

    recognition.start()
    isRecording.value = true
  }

  function stopVoice() {
    recognition?.stop()
    isRecording.value = false
  }

  function handleFiles(files: FileList) {
    onAttach?.(files)
  }

  // Event handlers
  const textareaListeners = {
    input(e: Event) {
      value.value = (e.target as HTMLTextAreaElement).value
      autoResize()
    },
    keydown(e: KeyboardEvent) {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        submit()
      }
      // Ctrl/Cmd+Enter also submits
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        submit()
      }
    },
    paste(e: ClipboardEvent) {
      // Handle image paste
      const items = Array.from(e.clipboardData?.items ?? [])
      const imageItem = items.find(i => i.type.startsWith('image/'))
      if (imageItem) {
        const file = imageItem.getAsFile()
        if (file) {
          const dt = new DataTransfer()
          dt.items.add(file)
          onAttach?.(dt.files)
        }
      }
    },
  }

  // Attr objects
  const textareaAttrs = {
    placeholder,
    maxlength: maxLength,
    rows: 1,
    'aria-label': 'Message input',
    'aria-multiline': 'true',
    'aria-describedby': 'sender-hint',
  }

  const sendButtonAttrs = {
    type: 'button' as const,
    'aria-label': isGenerating ? 'Stop generation' : 'Send message',
    disabled: !canSubmit.value && !isGenerating,
  }

  const stopButtonAttrs = {
    type: 'button' as const,
    'aria-label': 'Stop generation',
  }

  const voiceButtonAttrs = {
    type: 'button' as const,
    'aria-label': isRecording.value ? 'Stop recording' : 'Start voice input',
    'aria-pressed': String(isRecording.value),
  }

  const fileInputAttrs = {
    type: 'file' as const,
    multiple: true,
    'aria-label': 'Attach files',
  }

  return {
    value,
    isRecording: readonly(isRecording),
    charCount,
    remainingChars,
    isOverLimit,
    isNearLimit,
    canSubmit,
    submit,
    clear,
    insertText,
    startVoice,
    stopVoice,
    handleFiles,
    textareaListeners,
    textareaAttrs,
    sendButtonAttrs,
    stopButtonAttrs,
    voiceButtonAttrs,
    fileInputAttrs,
    textareaRef,
  }
}
