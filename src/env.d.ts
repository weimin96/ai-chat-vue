declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

interface AiChatSpeechRecognitionResult {
  readonly transcript: string
}

interface AiChatSpeechRecognitionResultList {
  readonly length: number
  [index: number]: AiChatSpeechRecognitionResult[]
}

interface AiChatSpeechRecognitionEvent extends Event {
  readonly results: AiChatSpeechRecognitionResultList
}

interface AiChatSpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: AiChatSpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

interface AiChatSpeechRecognitionConstructor {
  new(): AiChatSpeechRecognition
}

interface Window {
  SpeechRecognition?: AiChatSpeechRecognitionConstructor
  webkitSpeechRecognition?: AiChatSpeechRecognitionConstructor
}
