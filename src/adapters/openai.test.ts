import { afterEach, describe, expect, it, vi } from 'vitest'

import { createCustomAdapter, createOpenAIAdapter } from './openai'

describe('createOpenAIAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('把外部 AbortSignal 直接传给 fetch', async () => {
    const controller = new AbortController()
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        new ReadableStream({
          start(streamController) {
            streamController.close()
          },
        }),
        { status: 200 }
      )
    )

    const adapter = createOpenAIAdapter({ apiKey: 'key' })

    for await (const _chunk of adapter.stream([], {}, controller.signal)) {
      break
    }

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBe(controller.signal)
  })
})

describe('createCustomAdapter', () => {
  it('把外部 AbortSignal 传给自定义 handler', async () => {
    const controller = new AbortController()
    let receivedSignal: AbortSignal | null = null
    const adapter = createCustomAdapter(
      async function* (_messages, _config, signal) {
        receivedSignal = signal
        yield { type: 'done' }
      }
    )

    for await (const _chunk of adapter.stream([], {}, controller.signal)) {
      break
    }

    expect(receivedSignal).toBe(controller.signal)
  })
})
