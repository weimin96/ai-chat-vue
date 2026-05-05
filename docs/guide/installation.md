# 安装

## 环境要求

- Vue `^3.5.33`
- Node.js `^20.19.0 || >=22.12.0`
- 支持 Vite、Nuxt 或其他 Vue 3 构建工具

## 安装依赖

```powershell
npm install @weimin96/ai-chat-vue
```

## 引入样式

```ts
import '@weimin96/ai-chat-vue/styles'
```

## 使用组件

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

## 适配器

`ChatProvider` 接收 `StreamAdapter`。生产环境应显式传入适配器，否则发送消息不会产生助手回复。
