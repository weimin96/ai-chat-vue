import { describe, expect, it } from 'vitest'

import { parseNdjson, parseSSE } from './streamParsers'

function createChunkedResponse(chunks: string[]) {
  const encoder = new TextEncoder()

  return new Response(new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk))
      }
      controller.close()
    },
  }))
}

describe('streamParsers', () => {
  it('解析跨 chunk 的 NDJSON', async () => {
    const response = createChunkedResponse([
      '{"message":{"content":"你',
      '好"},"done":false}\n{"done":',
      'true}\n',
    ])
    const chunks = []

    for await (const chunk of parseNdjson(response)) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual([
      { message: { content: '你好' }, done: false },
      { done: true },
    ])
  })

  it('解析跨 chunk 的 SSE data 行', async () => {
    const response = createChunkedResponse([
      'data: {"delta":"你',
      '好"}\n\n',
      'data: [DONE]\n',
    ])
    const chunks = []

    for await (const chunk of parseSSE(response)) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual(['{"delta":"你好"}', '[DONE]'])
  })
})
