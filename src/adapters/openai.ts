// ============================================================
// Adapters
// ============================================================
import type { StreamAdapter, StreamChunk, Message, ChatConfig } from '../types'

function messagesToOpenAI(messages: Message[], config: ChatConfig) {
  const mappedMessages = messages.map(m => ({
    role: m.role,
    content: m.content,
  }))

  if (!config.systemPrompt?.trim()) {
    return mappedMessages
  }

  return [
    { role: 'system', content: config.systemPrompt },
    ...mappedMessages,
  ]
}

// --- OpenAI Adapter ---
export function createOpenAIAdapter(options: {
  apiKey: string
  baseURL?: string
  model?: string
}): StreamAdapter {
  const { apiKey, baseURL = 'https://api.openai.com/v1', model = 'gpt-4o' } = options
  let abortCtrl: AbortController | null = null

  return {
    name: 'openai',
    abort() { abortCtrl?.abort() },
    async *stream(messages: Message[], config: ChatConfig): AsyncIterable<StreamChunk> {
      abortCtrl = new AbortController()
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        signal: abortCtrl.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: config.model ?? model,
          messages: messagesToOpenAI(messages, config),
          stream: true,
          max_tokens: config.maxTokens ?? 4096,
          temperature: config.temperature ?? 0.7,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        yield { type: 'error', error: err.error?.message ?? 'OpenAI API error' }
        return
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') { yield { type: 'done' }; return }
          try {
            const json = JSON.parse(data)
            const delta = json.choices?.[0]?.delta
            if (delta?.content) yield { type: 'text', content: delta.content }
            if (delta?.reasoning_content) yield { type: 'thinking', content: delta.reasoning_content }
          } catch { /* skip */ }
        }
      }
    },
  }
}

// --- Ollama Adapter ---
export function createOllamaAdapter(options: {
  baseURL?: string
  model?: string
}): StreamAdapter {
  const { baseURL = 'http://localhost:11434', model = 'llama3.2' } = options

  return {
    name: 'ollama',
    async *stream(messages: Message[], config: ChatConfig): AsyncIterable<StreamChunk> {
      const response = await fetch(`${baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model ?? model,
          messages: messagesToOpenAI(messages, config),
          stream: true,
        }),
      })

      if (!response.ok) {
        yield { type: 'error', error: 'Ollama API error' }
        return
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        for (const line of text.split('\n').filter(Boolean)) {
          try {
            const json = JSON.parse(line)
            if (json.message?.content) yield { type: 'text', content: json.message.content }
            if (json.done) yield { type: 'done' }
          } catch { /* skip */ }
        }
      }
    },
  }
}

// --- Custom Adapter ---
export function createCustomAdapter(
  handler: (messages: Message[], config: ChatConfig, signal: AbortSignal) => AsyncIterable<StreamChunk>
): StreamAdapter {
  let abortCtrl: AbortController | null = null
  return {
    name: 'custom',
    abort() { abortCtrl?.abort() },
    stream(messages: Message[], config: ChatConfig) {
      abortCtrl = new AbortController()
      return handler(messages, config, abortCtrl.signal)
    },
  }
}

// --- AI SDK Adapter (Vercel AI SDK compatible) ---
export function createAISDKAdapter(options: {
  endpoint: string
  headers?: Record<string, string>
}): StreamAdapter {
  return {
    name: 'ai-sdk',
    async *stream(messages: Message[], config: ChatConfig): AsyncIterable<StreamChunk> {
      const response = await fetch(options.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...options.headers },
        body: JSON.stringify({ messages: messagesToOpenAI(messages, config), config }),
      })

      if (!response.ok) {
        yield { type: 'error', error: 'API error' }
        return
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        // Vercel AI SDK uses "0:" prefix for text
        for (const line of text.split('\n').filter(Boolean)) {
          if (line.startsWith('0:')) {
            try {
              const content = JSON.parse(line.slice(2))
              yield { type: 'text', content }
            } catch { /* skip */ }
          }
        }
      }
      yield { type: 'done' }
    },
  }
}
