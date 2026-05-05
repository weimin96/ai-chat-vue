<script setup lang="ts">
import { ChatProvider, ChatContainer } from '@weimin96/ai-chat-vue'
import {
  demoAdapter,
  promptCards,
  suggestions,
} from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview">
      <div class="docs-chat-shell">
        <ChatProvider
          :adapter="demoAdapter"
          :config="{ locale: 'zh-CN', enableMarkdown: true }"
        >
          <ChatContainer
            welcome-title="ChatProvider 示例"
            welcome-subtitle="Provider 负责提供会话上下文和流式适配器。"
            :prompt-cards="promptCards"
            :suggestions="suggestions"
            placeholder="输入一条测试消息..."
          />
        </ChatProvider>
      </div>
    </div>
  </div>
</template>
