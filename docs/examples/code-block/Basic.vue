<script setup lang="ts">
import { CodeBlock } from '@ai-chat/vue'

const code = `import { ChatProvider } from '@ai-chat/vue'

export function setup() {
  return ChatProvider
}`
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview">
      <CodeBlock
        language="typescript"
        filename="usage.ts"
        :code="code"
        show-line-numbers
      />
    </div>
  </div>
</template>
