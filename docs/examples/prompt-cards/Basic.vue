<script setup lang="ts">
import { ref } from 'vue'
import { PromptCards } from '@ai-chat/vue'
import { promptCards } from '../../.vitepress/theme/demo-data'

const selected = ref('尚未选择')
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview">
      <PromptCards
        :cards="promptCards"
        @select="(prompt) => (selected = prompt)"
      />
      <p style="margin-top: 12px; font-size: 13px">当前选择：{{ selected }}</p>
    </div>
  </div>
</template>
