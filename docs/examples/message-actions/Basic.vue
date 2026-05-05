<script setup lang="ts">
import { MessageActions } from '@weimin96/ai-chat-vue'
import { sampleMessages } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <MessageActions :message="sampleMessages[1]" :is-user="false" />
</template>
