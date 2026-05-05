<script setup lang="ts">
import { Bubble } from '@weimin96/ai-chat-vue'
import { sampleMessages } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="docs-narrow">
    <Bubble :message="sampleMessages[0]" />
    <Bubble :message="sampleMessages[1]" />
  </div>
</template>
