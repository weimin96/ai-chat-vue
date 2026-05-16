function createParseError(message: string, cause: unknown) {
  const error = new Error(message) as Error & { cause?: unknown }
  error.cause = cause
  return error
}

export async function* parseTextLines(response: Response): AsyncIterable<string> {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('响应体为空')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      yield line
    }
  }

  buffer += decoder.decode()
  if (buffer) yield buffer
}

export async function* parseSSE(response: Response): AsyncIterable<string> {
  for await (const line of parseTextLines(response)) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('data:')) continue
    yield trimmed.slice(5).trim()
  }
}

export async function* parseNdjson<T>(response: Response): AsyncIterable<T> {
  for await (const line of parseTextLines(response)) {
    const trimmed = line.trim()
    if (!trimmed) continue

    try {
      yield JSON.parse(trimmed) as T
    } catch (err: unknown) {
      const reason = err instanceof Error ? err.message : '未知解析错误'
      throw createParseError(`NDJSON 解析失败：${reason}`, err)
    }
  }
}
