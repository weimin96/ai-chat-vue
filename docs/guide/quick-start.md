# 快速开始

下面示例使用本地 mock 适配器演示流式回复。实际项目中可替换为 OpenAI、Ollama 或自定义后端。

<script setup>
import Basic from '../examples/chat-container/Basic.vue'
</script>

<Basic />

## 最小结构

```vue
<script setup lang="ts">
import { ChatProvider, ChatContainer } from '@weimin96/ai-chat-vue'
import type { StreamAdapter } from '@weimin96/ai-chat-vue'

const adapter: StreamAdapter = {
  name: 'custom',
  async *stream() {
    yield { type: 'text', content: '你好，这是来自适配器的回复。' }
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
