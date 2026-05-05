<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <section class="docs-import-usage">
    <div>
      <h3>按需导入</h3>
      <pre><code>{{ `import { ${name} } from '@weimin96/ai-chat-vue'
import '@weimin96/ai-chat-vue/styles'` }}</code></pre>
    </div>
    <div>
      <h3>完整导入</h3>
      <pre><code>{{ `import * as AiChatVue from '@weimin96/ai-chat-vue'
import '@weimin96/ai-chat-vue/styles'

app.use(AiChatVue)

// 模板中可直接使用 <${name} />` }}</code></pre>
    </div>
  </section>
</template>
