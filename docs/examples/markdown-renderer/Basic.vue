<script setup lang="ts">
import { MarkdownRenderer } from '@ai-chat/vue'

const content = `# Markdown 示例

- 支持列表
- 支持 **加粗**
- 支持 \`inline code\`

\`\`\`ts
const message = 'hello'
\`\`\`
`
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview docs-narrow">
      <MarkdownRenderer :content="content" />
    </div>
  </div>
</template>
