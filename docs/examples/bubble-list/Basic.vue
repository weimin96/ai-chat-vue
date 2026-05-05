<script setup lang="ts">
import { BubbleList } from '@weimin96/ai-chat-vue'
import { sampleMessages } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div style="height: 420px">
    <BubbleList :messages="sampleMessages" enable-markdown />
  </div>
</template>
