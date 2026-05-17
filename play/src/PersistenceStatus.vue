<script setup lang="ts">
import { computed } from 'vue'
import { useChat } from '@weimin96/ai-chat-vue'

const props = defineProps<{
  storageKey: string
}>()

const chat = useChat()

const statusText = computed(() => {
  if (!chat.isPersistenceReady.value) return '读取中'
  if (chat.persistenceError.value) return chat.persistenceError.value
  return '已连接'
})

const conversationText = computed(() => `${chat.conversations.value.length} 个会话`)
const messageText = computed(() => `${chat.messages.value.length} 条消息`)

function clearLocalData() {
  try {
    window.localStorage.removeItem(props.storageKey)
    window.location.reload()
  } catch (err: unknown) {
    chat.persistenceError.value = err instanceof Error ? err.message : '清空本地数据失败'
  }
}
</script>

<template>
  <div class="play-persistence-status">
    <div>
      <span class="play-status-label">localStorage</span>
      <strong>{{ statusText }}</strong>
    </div>
    <div>
      <span class="play-status-label">会话</span>
      <strong>{{ conversationText }}</strong>
    </div>
    <div>
      <span class="play-status-label">消息</span>
      <strong>{{ messageText }}</strong>
    </div>
    <button type="button" @click="clearLocalData">
      清空本地数据
    </button>
  </div>
</template>
