<script setup lang="ts">
import { ToolCallCard } from '@weimin96/ai-chat-vue'
import { sampleToolCall } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview docs-narrow">
      <ToolCallCard :tool-call="sampleToolCall" />
    </div>
  </div>
</template>
