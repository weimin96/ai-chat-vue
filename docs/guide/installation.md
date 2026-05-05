<script setup>
import Basic from '../examples/chat-container/Basic.vue'
import source from '../examples/chat-container/Basic.vue?raw'
</script>

# 安装

## 环境要求

- Vue `^3.5.33`
- Node.js `^20.19.0 || >=22.12.0`
- 支持 Vite、Nuxt 或其他 Vue 3 构建工具

## 安装依赖

<PackageTabs />

## 引入样式

```ts
import '@weimin96/ai-chat-vue/styles'
```

## 使用组件

### 按需导入

```vue
<script setup lang="ts">
import { ChatProvider, ChatContainer } from '@weimin96/ai-chat-vue'
</script>

<template>
  <ChatProvider>
    <ChatContainer />
  </ChatProvider>
</template>
```

### 完整导入

```ts
import { createApp } from 'vue'
import * as AiChatVue from '@weimin96/ai-chat-vue'
import '@weimin96/ai-chat-vue/styles'
import App from './App.vue'

createApp(App).use(AiChatVue).mount('#app')
```

### 组件示例

<ExampleBlock :source="source" layout="split">
  <Basic />
</ExampleBlock>

## 适配器

`ChatProvider` 接收 `StreamAdapter`。生产环境应显式传入适配器，否则发送消息不会产生助手回复。
