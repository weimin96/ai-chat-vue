import { ref, computed, readonly, type ComputedRef, type Ref } from 'vue'

export interface UseHeadlessSenderOptions {
  onSend: (content: string) => void | Promise<void>
  onStop?: () => void
  onAttach?: (files: FileList) => void
  isGenerating?: boolean
  maxLength?: number
  placeholder?: string
}

export interface UseHeadlessSenderReturn {
  value: Ref<string>
  isRecording: Readonly<Ref<boolean>>
  charCount: ComputedRef<number>
  remainingChars: ComputedRef<number>
  isOverLimit: ComputedRef<boolean>
  canSubmit: ComputedRef<boolean>
  isNearLimit: ComputedRef<boolean>

  submit: () => void
  clear: () => void
  insertText: (text: string) => void
  startVoice: () => Promise<void>
  stopVoice: () => void
  handleFiles: (files: FileList) => void

  textareaListeners: {
    input: (e: Event) => void
    keydown: (e: KeyboardEvent) => void
    paste: (e: ClipboardEvent) => void
  }

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

  textareaRef: Ref<HTMLTextAreaElement | null>
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

  let recognition: AiChatSpeechRecognition | null = null

  const charCount = computed(() => value.value.length)
  const remainingChars = computed(() => maxLength - charCount.value)
  const isOverLimit = computed(() => charCount.value > maxLength)
  const isNearLimit = computed(() => charCount.value > maxLength * 0.8)
  const canSubmit = computed(() => value.value.trim().length > 0 && !isOverLimit.value && !isGenerating)

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
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + text.length
        autoResize()
      })
    } else {
      value.value += text
    }
  }

  async function startVoice() {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!SR) throw new Error('SpeechRecognition not supported')

    recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'zh-CN'

    recognition.onresult = (e: AiChatSpeechRecognitionEvent) => {
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
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        submit()
      }
    },
    paste(e: ClipboardEvent) {
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
