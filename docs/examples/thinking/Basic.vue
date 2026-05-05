<script setup lang="ts">
import { Thinking } from '@weimin96/ai-chat-vue'
import { sampleThinking } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="docs-narrow">
    <Thinking :steps="sampleThinking" />
  </div>
</template>
