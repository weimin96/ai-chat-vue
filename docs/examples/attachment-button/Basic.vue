<script setup lang="ts">
import { ref } from 'vue'
import { AttachmentButton } from '@weimin96/ai-chat-vue'

const fileCount = ref(0)
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview flex items-center gap-3">
      <AttachmentButton @attach="(files) => (fileCount = files.length)" />
      <span>已选择文件数：{{ fileCount }}</span>
    </div>
  </div>
</template>
