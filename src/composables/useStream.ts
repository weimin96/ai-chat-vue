// ============================================================
// useStream - Streaming Utilities
// ============================================================
import { ref, readonly } from 'vue'
import type { StreamChunk } from '../types'

export function useStream() {
  const isStreaming = ref(false)
  const buffer = ref('')
  const error = ref<string | null>(null)

  /**
   * Parse SSE stream from fetch response
   */
  async function* parseSSE(response: Response): AsyncIterable<string> {
    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buf = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop() ?? ''
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()
          if (data && data !== '[DONE]') yield data
        }
      }
    }
  }

  /**
   * Parse OpenAI-compatible streaming response
   */
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
        // Skip malformed chunks
      }
    }
  }

  /**
   * Simulated typewriter effect for demos
   */
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
