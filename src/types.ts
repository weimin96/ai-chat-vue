// ============================================================
// Core Types
// ============================================================

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

export type ArtifactType = 'html' | 'vue' | 'markdown' | 'mermaid' | 'json' | 'csv' | 'code'

export type ConversationExportFormat = 'json' | 'markdown' | 'text'

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
  status: 'pending' | 'running' | 'success' | 'error'
  result?: unknown
  error?: string
  durationMs?: number
}

export interface ThinkingStep {
  id: string
  content: string
  isComplete: boolean
}

export interface Artifact {
  id: string
  type: ArtifactType
  title: string
  content: string
  language?: string
  version: number
  history: Array<{ version: number; content: string; timestamp: number }>
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  preview?: string
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  thinking?: ThinkingStep[]
  toolCalls?: ToolCall[]
  artifacts?: Artifact[]
  attachments?: Attachment[]
  timestamp: number
  isStreaming?: boolean
  isError?: boolean
  errorMessage?: string
  metadata?: Record<string, unknown>
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  isPinned?: boolean
  isArchived?: boolean
  model?: string
  systemPrompt?: string
}

export interface ChatConfig {
  model?: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
  enableMarkdown?: boolean
  enableArtifacts?: boolean
  enableThinking?: boolean
  enableToolCalls?: boolean
  enableVoice?: boolean
  enableAttachments?: boolean
  locale?: 'zh-CN' | 'en-US'
  theme?: 'light' | 'dark' | 'auto'
  density?: 'compact' | 'default' | 'comfortable'
}

export interface StreamAdapter {
  name: string
  stream(messages: Message[], config: ChatConfig, signal?: AbortSignal): AsyncIterable<StreamChunk>
  abort?(): void
}

export interface ChatPersistenceAdapter {
  load(): Conversation[] | Promise<Conversation[]>
  loadMessages?(conversationId: string): Message[] | Promise<Message[]>
  save(conversations: Conversation[]): void | Promise<void>
}

export interface StreamChunk {
  type: 'text' | 'thinking' | 'tool_call' | 'tool_result' | 'artifact' | 'error' | 'done'
  content?: string
  toolCall?: Partial<ToolCall>
  artifact?: Partial<Artifact>
  error?: string
}

export interface ChatContext {
  config: ChatConfig
  adapter: StreamAdapter | null
  conversations: Conversation[]
  activeConversationId: string | null
}

// Alias for backwards compatibility
export type ToolResult = ToolCall
