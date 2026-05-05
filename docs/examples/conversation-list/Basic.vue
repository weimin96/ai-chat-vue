<script setup lang="ts">
import { onMounted } from 'vue'
import { ChatProvider, ConversationList, useChat } from '@weimin96/ai-chat-vue'

function SeedConversations() {
  const chat = useChat()
  onMounted(() => {
    if (chat.conversations.value.length) return
    const first = chat.createConversation('产品方案讨论')
    chat.addMessage({ role: 'user', content: '整理组件文档结构。' })
    chat.pinConversation(first.id, true)
    chat.createConversation('流式输出验证')
    chat.addMessage({ role: 'assistant', content: '本地适配器已准备完成。' })
  })
  return () => null
}
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview">
      <div style="height: 360px; max-width: 340px">
        <ChatProvider>
          <SeedConversations />
          <ConversationList />
        </ChatProvider>
      </div>
    </div>
  </div>
</template>
