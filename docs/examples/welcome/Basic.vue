<script setup lang="ts">
import { Welcome, PromptCards } from '@ai-chat/vue'
import { promptCards } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview" style="min-height: 360px">
      <Welcome
        title="欢迎使用 @ai-chat/vue"
        subtitle="从提示卡片开始一次本地模拟对话。"
      >
        <PromptCards :cards="promptCards" />
      </Welcome>
    </div>
  </div>
</template>
