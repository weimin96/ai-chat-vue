<script setup lang="ts">
import { Bubble } from '@weimin96/ai-chat-vue'
import { sampleMessages } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview docs-narrow">
      <Bubble :message="sampleMessages[0]" />
      <Bubble :message="sampleMessages[1]" />
    </div>
  </div>
</template>
