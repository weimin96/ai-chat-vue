<script setup lang="ts">
import { MessageActions } from '@weimin96/ai-chat-vue'
import { sampleMessages } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview">
      <MessageActions :message="sampleMessages[1]" :is-user="false" />
    </div>
  </div>
</template>
