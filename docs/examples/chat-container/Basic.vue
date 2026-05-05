<script setup lang="ts">
import { ChatContainer, ChatProvider } from '@weimin96/ai-chat-vue'
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
        <ChatProvider :adapter="demoAdapter">
          <ChatContainer
            welcome-title="开始对话"
            welcome-subtitle="ChatContainer 组合欢迎页、消息列表和输入框。"
            :prompt-cards="promptCards"
            :suggestions="suggestions"
          >
            <template #footer>文档示例使用本地模拟回复。</template>
          </ChatContainer>
        </ChatProvider>
      </div>
    </div>
  </div>
</template>
