<script setup lang="ts">
import { ToolCallCard } from '@weimin96/ai-chat-vue'
import { sampleToolCall } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="docs-narrow">
    <ToolCallCard :tool-call="sampleToolCall" />
  </div>
</template>
