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
  async *stream(_messages, _config) {
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

使用 `createCustomAdapter` 时，第三个参数是内部创建的 `AbortSignal`。停止生成会触发该 signal，应直接传给 `fetch`：

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
