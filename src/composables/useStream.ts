import { ref, readonly } from 'vue'
import { parseSSE as parseSSEData } from '../utils/streamParsers'
import type { StreamChunk } from '../types'

export function useStream() {
  const isStreaming = ref(false)
  const buffer = ref('')
  const error = ref<string | null>(null)

  async function* parseSSE(response: Response): AsyncIterable<string> {
    for await (const data of parseSSEData(response)) {
      if (data && data !== '[DONE]') yield data
    }
  }

  async function* parseOpenAIStream(response: Response): AsyncIterable<StreamChunk> {
    for await (const raw of parseSSE(response)) {
      try {
        const json = JSON.parse(raw)
        const delta = json.choices?.[0]?.delta

        if (delta?.reasoning_content) {
          yield { type: 'thinking', content: delta.reasoning_content }
        }
        if (delta?.content) {
          yield { type: 'text', content: delta.content }
        }
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            yield {
              type: 'tool_call',
              toolCall: {
                id: tc.id,
                name: tc.function?.name,
                arguments: tc.function?.arguments ? JSON.parse(tc.function.arguments) : {},
                status: 'running',
              },
            }
          }
        }
        if (json.choices?.[0]?.finish_reason === 'stop') {
          yield { type: 'done' }
        }
      } catch {
        yield { type: 'error', error: 'OpenAI 流式响应解析失败' }
        return
      }
    }
  }

  async function* typewriterStream(text: string, delayMs = 20): AsyncIterable<StreamChunk> {
    const words = text.split(' ')
    for (const word of words) {
      yield { type: 'text', content: word + ' ' }
      await new Promise(r => setTimeout(r, delayMs + Math.random() * 30))
    }
    yield { type: 'done' }
  }

  return {
    isStreaming: readonly(isStreaming),
    buffer: readonly(buffer),
    error: readonly(error),
    parseSSE,
    parseOpenAIStream,
    typewriterStream,
  }
}
