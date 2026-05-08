# Adapters 适配器

适配器把组件库的消息与配置转换为模型服务请求，并以 `StreamChunk` 形式返回流式结果。

## OpenAI 兼容接口

```ts
import { createOpenAIAdapter } from '@weimin96/ai-chat-vue'

const adapter = createOpenAIAdapter({
  apiKey: '由服务端代理注入',
  baseURL: 'https://api.openai.com/v1',
  model: 'gpt-4o',
})
```

| 配置 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `apiKey` | `string` | 必填 | OpenAI 兼容接口密钥 |
| `baseURL` | `string` | `https://api.openai.com/v1` | API 根地址 |
| `model` | `string` | `gpt-4o` | 默认模型 |

真实密钥不应放进浏览器 bundle。生产环境建议使用自定义后端代理，并在代理里调用 OpenAI 兼容接口。

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

## 中断与重连

组件库不会在 SSE 或网络断开后自动重连。自动重试涉及幂等性、已接收 token 合并、账单重复请求和服务端会话游标，这些信息只有业务后端最清楚。生产环境需要重连时，应在自定义适配器或后端代理层实现，并在恢复失败时 yield `error` chunk。
