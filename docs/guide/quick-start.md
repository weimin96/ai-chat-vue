<script setup>
import Basic from '../examples/chat-container/Basic.vue'
import source from '../examples/chat-container/Basic.vue?raw'
</script>

# 快速开始

下面示例使用本地 mock 适配器演示流式回复。实际项目中可替换为 OpenAI、Ollama 或自定义后端。

## 使用说明

1. 在应用入口引入 `@weimin96/ai-chat-vue/styles`。
2. 使用 `ChatProvider` 包裹聊天区域，并传入 `StreamAdapter`。
3. 在 `ChatProvider` 内放置 `ChatContainer` 或按需组合消息、输入框等组件。

<ExampleBlock :source="source" layout="split">
  <Basic />
</ExampleBlock>

## 最小结构

```vue
<script setup lang="ts">
import { ChatProvider, ChatContainer } from '@weimin96/ai-chat-vue'
import type { StreamAdapter } from '@weimin96/ai-chat-vue'

const adapter: StreamAdapter = {
  name: 'custom',
  async *stream(_messages, _config, _signal) {
    yield { type: 'text', content: '你好，这是来自适配器的回复。' }
    yield { type: 'done' }
  },
}
</script>

<template>
  <ChatProvider :adapter="adapter">
    <ChatContainer />
  </ChatProvider>
</template>
```

## 设计约束

`ChatContainer` 依赖 `ChatProvider` 提供上下文。若跳过 Provider，内部 `useChat()` 会抛出错误。

## 停止生成

`useChat().stopGeneration()` 会中断当前请求、调用适配器的 `abort()` 兜底入口，并把正在流式输出的助手消息标记为结束。

使用 `createCustomAdapter` 时，第三个参数是本次生成的 `AbortSignal`。停止生成会触发该 signal，应直接传给 `fetch`：

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

  yield { type: 'done' }
})
```

Abort 不会被写入错误消息。需要展示业务失败时，适配器应返回 `error` chunk：

```ts
yield { type: 'error', error: '请求失败' }
```

## 刷新保留会话

`ChatProvider` 可以接收持久化适配器。浏览器端本地验证可使用 `createLocalStoragePersistence()`：

```ts
import { createLocalStoragePersistence } from '@weimin96/ai-chat-vue'

const persistence = createLocalStoragePersistence({
  key: 'demo:conversations',
})
```

```vue
<ChatProvider :adapter="adapter" :persistence="persistence">
  <ChatContainer />
</ChatProvider>
```

SSR 或预渲染阶段没有可用 Storage 时，内置本地持久化会返回空会话，不会访问全局 `localStorage`。
