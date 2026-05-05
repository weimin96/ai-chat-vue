<script setup lang="ts">
import { MermaidBlock } from '@weimin96/ai-chat-vue'

const code = `flowchart LR
  A["用户输入"] --> B["发送消息"]
  B --> C["流式回复"]
  C --> D["渲染组件"]`
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview">
      <MermaidBlock id="docs-basic-flow" :code="code" />
    </div>
  </div>
</template>
