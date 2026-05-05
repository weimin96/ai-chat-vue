<script setup lang="ts">
import { CodeBlock } from '@weimin96/ai-chat-vue'

const code = `import { ChatProvider } from '@weimin96/ai-chat-vue'

export function setup() {
  return ChatProvider
}`
</script>

<template>
  <CodeBlock
    language="typescript"
    filename="usage.ts"
    :code="code"
    show-line-numbers
  />
</template>
