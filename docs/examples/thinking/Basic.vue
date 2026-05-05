<script setup lang="ts">
import { Thinking } from '@weimin96/ai-chat-vue'
import { sampleThinking } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview docs-narrow">
      <Thinking :steps="sampleThinking" />
    </div>
  </div>
</template>
