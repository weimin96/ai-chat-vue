# Adapters 适配器

适配器把组件库的消息与配置转换为模型服务请求，并以 `StreamChunk` 形式返回流式结果。

## 生产代理

```ts
import { createAISDKAdapter } from '@weimin96/ai-chat-vue'

const adapter = createAISDKAdapter({
  endpoint: '/api/chat',
})
```

真实密钥不应放进浏览器 bundle。生产环境建议前端只调用自有后端代理，并在代理里读取 `OPENAI_API_KEY` 后请求 OpenAI 兼容接口。

## OpenAI 兼容接口

`createOpenAIAdapter` 会把 `apiKey` 写入 `Authorization` 请求头。它适合服务端、测试环境或受控兼容接口，不建议在浏览器端承载真实模型服务密钥。

```ts
import { createOpenAIAdapter } from '@weimin96/ai-chat-vue'

const adapter = createOpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY ?? '',
  baseURL: 'https://api.openai.com/v1',
  model: 'gpt-4o',
})
```

| 配置 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `apiKey` | `string` | 必填 | OpenAI 兼容接口密钥 |
| `baseURL` | `string` | `https://api.openai.com/v1` | API 根地址 |
| `model` | `string` | `gpt-4o` | 默认模型 |

`config.systemPrompt` 会作为第一条 `system` 消息注入请求。

## Ollama

```ts
import { createOllamaAdapter } from '@weimin96/ai-chat-vue'

const adapter = createOllamaAdapter({
  baseURL: 'http://localhost:11434',
  model: 'llama3.2',
})
```

| 配置 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `baseURL` | `string` | `http://localhost:11434` | Ollama 服务地址 |
| `model` | `string` | `llama3.2` | 默认模型 |

`config.systemPrompt` 会作为第一条 `system` 消息注入请求。

## Vercel AI SDK

```ts
import { createAISDKAdapter } from '@weimin96/ai-chat-vue'

const adapter = createAISDKAdapter({
  endpoint: '/api/chat',
  headers: { 'x-client': 'web' },
})
```

| 配置 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `endpoint` | `string` | 必填 | 业务侧 AI SDK 接口地址 |
| `headers` | `Record<string, string>` | `undefined` | 附加请求头 |

当前适配器按 Vercel AI SDK 文本流的 `0:` 前缀解析文本内容，并在流结束后发送 `done` chunk。

`config.systemPrompt` 会随 `messages` 一起发送给业务侧 AI SDK 接口。

## 自定义适配器

```ts
import { createCustomAdapter } from '@weimin96/ai-chat-vue'

const adapter = createCustomAdapter(async function* (messages, config, signal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, config }),
  })

  if (!response.ok) {
    yield { type: 'error', error: '请求失败' }
    return
  }

  yield { type: 'text', content: '你好。' }
  yield { type: 'done' }
})
```

`signal` 需要传给 `fetch` 或其它可取消请求。中途失败时建议 yield `error` chunk，并结束当前生成。

## StreamAdapter 契约

```ts
interface StreamAdapter {
  name: string
  stream(messages: Message[], config: ChatConfig, signal?: AbortSignal): AsyncIterable<StreamChunk>
  abort?(): void
}
```

`ChatProvider` 内部发送消息时会为每次生成创建独立 `AbortSignal`，并传给 `stream()`。调用 `stopGeneration()` 后，组件库会触发该 signal、调用可选的 `abort()`，并立即关闭当前流式消息状态。

内置 OpenAI、Ollama、AI SDK 和自定义适配器都会优先使用外部传入的 `signal`。如果业务代码绕过 `ChatProvider` 直接调用适配器且没有传入 `signal`，内置适配器会创建自己的请求控制器，此时 `adapter.abort()` 可中断该请求。

| Chunk 类型 | 说明 |
| ---- | ---- |
| `text` | 追加助手文本内容 |
| `thinking` | 追加思考过程内容 |
| `tool_call` | 创建或更新工具调用状态 |
| `tool_result` | 保留给工具结果流 |
| `artifact` | 创建或更新 Artifact |
| `error` | 标记当前助手消息失败 |
| `done` | 正常结束当前流 |

Abort 属于用户主动停止，不会产生 `error` chunk。网络错误、鉴权失败或业务异常应返回 `error` chunk，避免静默失败。

## 中断与重连

组件库不会在 SSE 或网络断开后自动重连。自动重试涉及幂等性、已接收 token 合并、账单重复请求和服务端会话游标，这些信息只有业务后端最清楚。生产环境需要重连时，应在自定义适配器或后端代理层实现，并在恢复失败时 yield `error` chunk。
