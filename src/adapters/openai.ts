import { parseNdjson, parseSSE, parseTextLines } from '../utils/streamParsers'
import type { ChatConfig, Message, StreamAdapter, StreamChunk } from '../types'

interface OpenAIStreamChunk {
  choices?: Array<{
    delta?: {
      content?: string
      reasoning_content?: string
    }
    finish_reason?: string | null
  }>
}

interface OllamaStreamChunk {
  message?: {
    content?: string
  }
  done?: boolean
}

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

function createRequestAbortController(signal?: AbortSignal) {
  const controller = new AbortController()

  if (!signal) {
    return {
      controller,
      cleanup: () => {},
    }
  }

  if (signal.aborted) {
    controller.abort()
    return {
      controller,
      cleanup: () => {},
    }
  }

  const abort = () => controller.abort()
  signal.addEventListener('abort', abort, { once: true })

  return {
    controller,
    cleanup: () => signal.removeEventListener('abort', abort),
  }
}

function isAbortError(err: unknown) {
  return err instanceof Error && err.name === 'AbortError'
}

async function readErrorMessage(response: Response, fallback: string) {
  let raw: string

  try {
    raw = await response.text()
  } catch {
    return fallback
  }

  if (!raw.trim()) return fallback

  try {
    const payload = JSON.parse(raw) as {
      error?: string | { message?: string }
      message?: string
    }

    if (typeof payload.error === 'string') return payload.error
    if (payload.error?.message) return payload.error.message
    if (payload.message) return payload.message
  } catch {
    return raw
  }

  return fallback
}

export function createOpenAIAdapter(options: {
  apiKey: string
  baseURL?: string
  model?: string
}): StreamAdapter {
  const { apiKey, baseURL = 'https://api.openai.com/v1', model = 'gpt-4o' } = options
  let abortCtrl: AbortController | null = null

  return {
    name: 'openai',
    abort() {
      abortCtrl?.abort()
    },
    async *stream(
      messages: Message[],
      config: ChatConfig,
      signal?: AbortSignal
    ): AsyncIterable<StreamChunk> {
      const request = createRequestAbortController(signal)
      abortCtrl = request.controller

      try {
        const response = await fetch(`${baseURL}/chat/completions`, {
          method: 'POST',
          signal: request.controller.signal,
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
          yield { type: 'error', error: await readErrorMessage(response, 'OpenAI 请求失败') }
          return
        }

        if (!response.body) {
          yield { type: 'error', error: 'OpenAI 响应体为空' }
          return
        }

        for await (const data of parseSSE(response)) {
          if (request.controller.signal.aborted) return
          if (!data) continue
          if (data === '[DONE]') {
            yield { type: 'done' }
            return
          }

          let json: OpenAIStreamChunk
          try {
            json = JSON.parse(data) as OpenAIStreamChunk
          } catch (err: unknown) {
            const reason = err instanceof Error ? err.message : '未知解析错误'
            yield { type: 'error', error: `OpenAI 流式响应解析失败：${reason}` }
            return
          }

          const choice = json.choices?.[0]
          const delta = choice?.delta
          if (delta?.content) yield { type: 'text', content: delta.content }
          if (delta?.reasoning_content) {
            yield { type: 'thinking', content: delta.reasoning_content }
          }
          if (choice?.finish_reason) {
            yield { type: 'done' }
            return
          }
        }

        yield { type: 'done' }
      } catch (err: unknown) {
        if (request.controller.signal.aborted || isAbortError(err)) return
        yield {
          type: 'error',
          error: err instanceof Error ? err.message : 'OpenAI 请求异常',
        }
      } finally {
        request.cleanup()
        if (abortCtrl === request.controller) abortCtrl = null
      }
    },
  }
}

export function createOllamaAdapter(options: {
  baseURL?: string
  model?: string
}): StreamAdapter {
  const { baseURL = 'http://localhost:11434', model = 'llama3.2' } = options
  let abortCtrl: AbortController | null = null

  return {
    name: 'ollama',
    abort() {
      abortCtrl?.abort()
    },
    async *stream(
      messages: Message[],
      config: ChatConfig,
      signal?: AbortSignal
    ): AsyncIterable<StreamChunk> {
      const request = createRequestAbortController(signal)
      abortCtrl = request.controller

      try {
        const response = await fetch(`${baseURL}/api/chat`, {
          method: 'POST',
          signal: request.controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: config.model ?? model,
            messages: messagesToOpenAI(messages, config),
            stream: true,
          }),
        })

        if (!response.ok) {
          yield { type: 'error', error: await readErrorMessage(response, 'Ollama 请求失败') }
          return
        }

        for await (const json of parseNdjson<OllamaStreamChunk>(response)) {
          if (request.controller.signal.aborted) return
          if (json.message?.content) yield { type: 'text', content: json.message.content }
          if (json.done) {
            yield { type: 'done' }
            return
          }
        }

        yield { type: 'done' }
      } catch (err: unknown) {
        if (request.controller.signal.aborted || isAbortError(err)) return
        yield {
          type: 'error',
          error: err instanceof Error ? err.message : 'Ollama 请求异常',
        }
      } finally {
        request.cleanup()
        if (abortCtrl === request.controller) abortCtrl = null
      }
    },
  }
}

export function createCustomAdapter(
  handler: (
    messages: Message[],
    config: ChatConfig,
    signal: AbortSignal
  ) => AsyncIterable<StreamChunk>
): StreamAdapter {
  let abortCtrl: AbortController | null = null

  return {
    name: 'custom',
    abort() {
      abortCtrl?.abort()
    },
    async *stream(
      messages: Message[],
      config: ChatConfig,
      signal?: AbortSignal
    ): AsyncIterable<StreamChunk> {
      const request = createRequestAbortController(signal)
      abortCtrl = request.controller

      try {
        for await (const chunk of handler(messages, config, request.controller.signal)) {
          if (request.controller.signal.aborted) return
          yield chunk
        }
      } catch (err: unknown) {
        if (request.controller.signal.aborted || isAbortError(err)) return
        yield {
          type: 'error',
          error: err instanceof Error ? err.message : '自定义适配器请求异常',
        }
      } finally {
        request.cleanup()
        if (abortCtrl === request.controller) abortCtrl = null
      }
    },
  }
}

export function createAISDKAdapter(options: {
  endpoint: string
  headers?: Record<string, string>
}): StreamAdapter {
  let abortCtrl: AbortController | null = null

  return {
    name: 'ai-sdk',
    abort() {
      abortCtrl?.abort()
    },
    async *stream(
      messages: Message[],
      config: ChatConfig,
      signal?: AbortSignal
    ): AsyncIterable<StreamChunk> {
      const request = createRequestAbortController(signal)
      abortCtrl = request.controller

      try {
        const response = await fetch(options.endpoint, {
          method: 'POST',
          signal: request.controller.signal,
          headers: { 'Content-Type': 'application/json', ...options.headers },
          body: JSON.stringify({ messages: messagesToOpenAI(messages, config), config }),
        })

        if (!response.ok) {
          yield { type: 'error', error: await readErrorMessage(response, 'AI SDK 请求失败') }
          return
        }

        for await (const line of parseTextLines(response)) {
          if (request.controller.signal.aborted) return
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('0:')) continue

          try {
            const content = JSON.parse(trimmed.slice(2)) as unknown
            if (typeof content === 'string') {
              yield { type: 'text', content }
            }
          } catch (err: unknown) {
            const reason = err instanceof Error ? err.message : '未知解析错误'
            yield { type: 'error', error: `AI SDK 流式响应解析失败：${reason}` }
            return
          }
        }

        yield { type: 'done' }
      } catch (err: unknown) {
        if (request.controller.signal.aborted || isAbortError(err)) return
        yield {
          type: 'error',
          error: err instanceof Error ? err.message : 'AI SDK 请求异常',
        }
      } finally {
        request.cleanup()
        if (abortCtrl === request.controller) abortCtrl = null
      }
    },
  }
}
