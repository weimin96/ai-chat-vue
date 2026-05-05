<script setup lang="ts">
import { Thinking } from '@ai-chat/vue'
import { sampleThinking } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview docs-narrow">
      <Thinking :steps="sampleThinking" />
    </div>
  </div>
</template>
