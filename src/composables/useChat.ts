// ============================================================
// useChat - Core Chat Composable
// ============================================================
import { ref, computed, inject, provide, type InjectionKey } from 'vue'
import type {
  Message,
  Conversation,
  ConversationExportFormat,
  ChatConfig,
  StreamAdapter,
  StreamChunk,
  ChatPersistenceAdapter,
} from '../types'

const CHAT_KEY: InjectionKey<ReturnType<typeof createChatState>> = Symbol('ai-chat')

function createChatState(
  config: ChatConfig,
  adapter: StreamAdapter | null,
  persistence: ChatPersistenceAdapter | null
) {
  const conversations = ref<Conversation[]>([])
  const activeId = ref<string | null>(null)
  const isGenerating = ref(false)
  const abortController = ref<AbortController | null>(null)
  const isPersistenceReady = ref(!persistence)
  const persistenceError = ref<string | null>(null)
  const isLoadingMessages = ref(false)
  const messageLoadError = ref<string | null>(null)

  const activeConversation = computed(() =>
    conversations.value.find(c => c.id === activeId.value) ?? null
  )

  const messages = computed(() => activeConversation.value?.messages ?? [])

  function createConversation(title = 'New Conversation'): Conversation {
    const conv: Conversation = {
      id: crypto.randomUUID(),
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    conversations.value.unshift(conv)
    activeId.value = conv.id
    void persistConversations()
    return conv
  }

  async function hydratePersistence() {
    if (!persistence) return

    try {
      const loadedConversations = await persistence.load()
      conversations.value = loadedConversations
      activeId.value = loadedConversations[0]?.id ?? null
      persistenceError.value = null
    } catch (err: unknown) {
      persistenceError.value = err instanceof Error ? err.message : '读取持久化数据失败'
    } finally {
      isPersistenceReady.value = true
    }
  }

  async function persistConversations() {
    if (!persistence || !isPersistenceReady.value) return

    try {
      await persistence.save(conversations.value)
      persistenceError.value = null
    } catch (err: unknown) {
      persistenceError.value = err instanceof Error ? err.message : '保存持久化数据失败'
    }
  }

  async function setActiveConversation(id: string) {
    activeId.value = id
    messageLoadError.value = null

    if (!persistence?.loadMessages) return

    const conv = conversations.value.find(c => c.id === id)
    if (!conv) return

    isLoadingMessages.value = true
    try {
      conv.messages = await persistence.loadMessages(id)
      messageLoadError.value = null
    } catch (err: unknown) {
      messageLoadError.value = err instanceof Error ? err.message : '加载会话消息失败'
    } finally {
      isLoadingMessages.value = false
    }
  }

  function deleteConversation(id: string) {
    const idx = conversations.value.findIndex(c => c.id === id)
    if (idx !== -1) conversations.value.splice(idx, 1)
    if (activeId.value === id) {
      activeId.value = conversations.value[0]?.id ?? null
    }
    void persistConversations()
  }

  function renameConversation(id: string, title: string) {
    const conv = conversations.value.find(c => c.id === id)
    if (conv) conv.title = title
    void persistConversations()
  }

  function pinConversation(id: string, pinned: boolean) {
    const conv = conversations.value.find(c => c.id === id)
    if (conv) conv.isPinned = pinned
    void persistConversations()
  }

  function addMessage(msg: Omit<Message, 'id' | 'timestamp'>): Message {
    if (!activeId.value) createConversation()
    const conv = activeConversation.value!
    const message: Message = { ...msg, id: crypto.randomUUID(), timestamp: Date.now() }
    conv.messages.push(message)
    conv.updatedAt = Date.now()
    // Auto-title from first user message
    if (conv.title === 'New Conversation' && msg.role === 'user') {
      conv.title = msg.content.slice(0, 40) + (msg.content.length > 40 ? '...' : '')
    }
    void persistConversations()
    return message
  }

  function updateMessage(id: string, updates: Partial<Message>) {
    const conv = activeConversation.value
    if (!conv) return
    const msg = conv.messages.find(m => m.id === id)
    if (msg) Object.assign(msg, updates)
    void persistConversations()
  }

  function deleteMessage(id: string) {
    const conv = activeConversation.value
    if (!conv) return
    const idx = conv.messages.findIndex(m => m.id === id)
    if (idx !== -1) conv.messages.splice(idx, 1)
    void persistConversations()
  }

  async function sendMessage(content: string) {
    if (!adapter || isGenerating.value) return
    if (!activeId.value) createConversation()

    addMessage({ role: 'user', content })

    const assistantMsg = addMessage({
      role: 'assistant',
      content: '',
      isStreaming: true,
    })

    isGenerating.value = true
    abortController.value = new AbortController()

    try {
      const stream = adapter.stream(messages.value, config)
      let accText = ''

      for await (const chunk of stream) {
        if (abortController.value?.signal.aborted) break
        if (chunk.type === 'error') {
          updateMessage(assistantMsg.id, {
            isError: true,
            isStreaming: false,
            errorMessage: chunk.error ?? '生成失败',
          })
          break
        }
        if (chunk.type === 'done') break
        await processChunk(chunk, assistantMsg.id, accText)
        if (chunk.type === 'text' && chunk.content) accText += chunk.content
      }
    } catch (err: unknown) {
      updateMessage(assistantMsg.id, {
        isError: true,
        isStreaming: false,
        errorMessage: err instanceof Error ? err.message : 'Generation failed',
      })
    } finally {
      updateMessage(assistantMsg.id, { isStreaming: false })
      isGenerating.value = false
      abortController.value = null
      void persistConversations()
    }
  }

  async function processChunk(chunk: StreamChunk, msgId: string, currentText: string) {
    const conv = activeConversation.value
    if (!conv) return
    const msg = conv.messages.find(m => m.id === msgId)
    if (!msg) return

    if (chunk.type === 'text' && chunk.content) {
      msg.content = currentText + chunk.content
    } else if (chunk.type === 'thinking' && chunk.content) {
      if (!msg.thinking) msg.thinking = []
      const last = msg.thinking[msg.thinking.length - 1]
      if (last && !last.isComplete) {
        last.content += chunk.content
      } else {
        msg.thinking.push({ id: crypto.randomUUID(), content: chunk.content, isComplete: false })
      }
    } else if (chunk.type === 'tool_call' && chunk.toolCall) {
      if (!msg.toolCalls) msg.toolCalls = []
      const existing = msg.toolCalls.find(t => t.id === chunk.toolCall!.id)
      if (existing) {
        Object.assign(existing, chunk.toolCall)
      } else {
        msg.toolCalls.push({
          id: chunk.toolCall.id ?? crypto.randomUUID(),
          name: chunk.toolCall.name ?? '',
          arguments: chunk.toolCall.arguments ?? {},
          status: chunk.toolCall.status ?? 'pending',
          ...chunk.toolCall,
        })
      }
    } else if (chunk.type === 'artifact' && chunk.artifact) {
      if (!msg.artifacts) msg.artifacts = []
      const existing = msg.artifacts.find(a => a.id === chunk.artifact!.id)
      if (existing) {
        existing.content = chunk.artifact.content ?? existing.content
      } else {
        msg.artifacts.push({
          id: chunk.artifact.id ?? crypto.randomUUID(),
          type: chunk.artifact.type ?? 'code',
          title: chunk.artifact.title ?? 'Artifact',
          content: chunk.artifact.content ?? '',
          version: 1,
          history: [],
          ...chunk.artifact,
        })
      }
    }
  }

  function stopGeneration() {
    abortController.value?.abort()
    isGenerating.value = false
    void persistConversations()
  }

  async function retryMessage(messageId: string) {
    const conv = activeConversation.value
    if (!conv) return
    const idx = conv.messages.findIndex(m => m.id === messageId)
    if (idx === -1) return
    // Remove from this message onward
    conv.messages.splice(idx)
    // Re-send last user message
    const lastUser = [...conv.messages].reverse().find(m => m.role === 'user')
    if (lastUser) await sendMessage(lastUser.content)
    await persistConversations()
  }

  function exportConversation(id: string, format: ConversationExportFormat = 'json'): string {
    const conv = conversations.value.find(c => c.id === id)
    if (!conv) return ''
    if (format === 'markdown') return formatConversationAsMarkdown(conv)
    if (format === 'text') return formatConversationAsText(conv)
    return JSON.stringify(conv, null, 2)
  }

  function formatConversationAsMarkdown(conversation: Conversation) {
    const lines = [`# ${conversation.title}`, '']

    for (const message of conversation.messages) {
      lines.push(`## ${message.role}`)
      lines.push('')
      lines.push(message.content)
      lines.push('')
    }

    return lines.join('\n').trimEnd()
  }

  function formatConversationAsText(conversation: Conversation) {
    return conversation.messages
      .map(message => `${message.role}: ${message.content}`)
      .join('\n\n')
  }

  void hydratePersistence()

  return {
    config,
    conversations,
    activeId,
    activeConversation,
    messages,
    isGenerating,
    isPersistenceReady,
    persistenceError,
    isLoadingMessages,
    messageLoadError,
    createConversation,
    deleteConversation,
    renameConversation,
    pinConversation,
    sendMessage,
    addMessage,
    updateMessage,
    deleteMessage,
    stopGeneration,
    retryMessage,
    exportConversation,
    persistConversations,
    setActive: setActiveConversation,
  }
}

export function provideChat(
  config: ChatConfig,
  adapter: StreamAdapter | null,
  persistence: ChatPersistenceAdapter | null = null
) {
  const state = createChatState(config, adapter, persistence)
  provide(CHAT_KEY, state)
  return state
}

export function useChat() {
  const ctx = inject(CHAT_KEY)
  if (!ctx) throw new Error('[ai-chat-vue] useChat must be used inside <ChatProvider>')
  return ctx
}
