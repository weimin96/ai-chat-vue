<script setup lang="ts">
import { ref } from 'vue'
import { Sender } from '@weimin96/ai-chat-vue'

const lastMessage = ref('尚未发送消息')
</script>

<template>
  <div>
    <Sender
      :suggestions="['写一段摘要', '生成测试清单']"
      placeholder="输入消息..."
      @send="(content) => (lastMessage = content)"
    />
    <p style="margin-top: 12px; font-size: 13px; color: var(--ac-muted)">
      最近发送：{{ lastMessage }}
    </p>
  </div>
</template>
