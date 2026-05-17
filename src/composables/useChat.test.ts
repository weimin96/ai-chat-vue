import { createApp } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { provideChat } from './useChat'
import type { StreamAdapter, StreamChunk } from '../types'

async function waitFor(assertion: () => void) {
  const startedAt = Date.now()
  let lastError: unknown

  while (Date.now() - startedAt < 1000) {
    try {
      assertion()
      return
    } catch (err: unknown) {
      lastError = err
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }

  throw lastError
}

describe('useChat', () => {
  it('停止生成时中断请求、调用适配器 abort 并立即关闭流式消息', async () => {
    const signalState: { received: AbortSignal | null } = { received: null }
    let releaseStream = () => {}
    let chat: ReturnType<typeof provideChat> | null = null

    const adapter: StreamAdapter = {
      name: 'test',
      abort: vi.fn(),
      async *stream(_messages, _config, signal): AsyncIterable<StreamChunk> {
        signalState.received = signal ?? null
        yield { type: 'text', content: '开始' }
        await new Promise<void>((resolve) => {
          releaseStream = resolve
        })
        yield { type: 'text', content: '不应出现' }
      },
    }

    const app = createApp({
      setup() {
        chat = provideChat({}, adapter)
        return () => null
      },
    })
    app.mount(document.createElement('div'))

    const sending = chat!.sendMessage('你好')

    await waitFor(() => {
      expect(signalState.received).toBeInstanceOf(AbortSignal)
      expect(chat!.messages.value.at(-1)?.content).toBe('开始')
      expect(chat!.messages.value.at(-1)?.isStreaming).toBe(true)
    })

    chat!.stopGeneration()

    expect(signalState.received?.aborted).toBe(true)
    expect(adapter.abort).toHaveBeenCalledTimes(1)
    expect(chat!.isGenerating.value).toBe(false)
    expect(chat!.messages.value.at(-1)?.isStreaming).toBe(false)

    releaseStream()
    await sending

    expect(chat!.messages.value.at(-1)?.content).toBe('开始')

    app.unmount()
  })
})
