<script setup lang="ts">
import { computed } from 'vue'
import { ChatContainer, ChatProvider, type StreamAdapter } from '@ai-chat/vue'
import type { StreamChunk } from '@ai-chat/vue'

const playConfig = {
  model: 'play-local',
  enableMarkdown: true,
  enableThinking: true,
  enableToolCalls: true,
  enableArtifacts: true,
  locale: 'zh-CN' as const,
}

const promptCards = [
  {
    title: '组件能力巡检',
    icon: 'UI',
    prompt: '演示一段包含 Markdown、列表和代码块的回复。',
  },
  {
    title: '流式交互',
    icon: 'AI',
    prompt: '模拟一次本地流式输出，并说明这个 play 如何引用源码。',
  },
  {
    title: '研发记录',
    icon: 'DEV',
    prompt: '生成一份本地测试检查清单。',
  },
]

const suggestions = [
  '展示 Markdown 渲染',
  '模拟工具调用状态',
  '说明 play 入口设计',
]

const playAdapter: StreamAdapter = {
  name: 'local-play-adapter',
  async *stream(messages): AsyncIterable<StreamChunk> {
    const lastMessage = messages[messages.length - 1]?.content ?? ''
    const chunks = createPlayChunks(lastMessage)

    for (const chunk of chunks) {
      await delay(180)
      yield chunk
    }
  },
}

const playPoints = computed(() => [
  'npm run dev 直接启动 play 应用',
  'play 通过 @ai-chat/vue 引用 src/index.ts',
  '库构建配置与演示应用配置互不混用',
])

function createPlayChunks(input: string): StreamChunk[] {
  return [
    {
      type: 'thinking',
      content: `识别到用户输入：“${input || '本地演示'}”。当前回复由 play 适配器生成，用于验证组件渲染和流式状态。`,
    },
    {
      type: 'text',
      content: '这是来自本地 play 适配器的回复。\n\n',
    },
    {
      type: 'text',
      content: '- 当前页面不是静态 CDN 演示，而是标准 Vite 应用。\n',
    },
    {
      type: 'text',
      content: '- 组件通过 `@ai-chat/vue` 导入，并由 alias 指向源码入口。\n',
    },
    {
      type: 'text',
      content: '- 修改 `src` 下的组件后，dev server 会直接热更新。\n\n',
    },
    {
      type: 'text',
      content:
        '```ts\nimport { ChatProvider, ChatContainer } from "@ai-chat/vue"\n```\n',
    },
  ]
}

function delay(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}
</script>

<template>
  <div class="play-shell">
    <aside class="play-sidebar">
      <div>
        <p class="play-eyebrow">本地组件实验台</p>
        <h1>@ai-chat/vue</h1>
        <p class="play-summary">
          独立 play 应用用于验证组件库源码导出面，避免把库根目录伪装成页面项目。
        </p>
      </div>

      <ul class="play-points">
        <li v-for="point in playPoints" :key="point">{{ point }}</li>
      </ul>
    </aside>

    <main class="play-main">
      <header class="play-header">
        <div>
          <p class="play-eyebrow">Vite Play</p>
          <h2>真实组件导出面测试</h2>
        </div>
        <span class="play-badge">本地适配器</span>
      </header>

      <section class="play-chat-card">
        <ChatProvider :config="playConfig" :adapter="playAdapter">
          <ChatContainer
            welcome-title="开始本地组件验证"
            welcome-subtitle="发送任意内容，play 会使用本地适配器模拟流式回复。"
            :prompt-cards="promptCards"
            :suggestions="suggestions"
            placeholder="输入一条测试消息..."
            enable-markdown
          >
            <template #footer> 本地演示数据仅用于组件交互验证。 </template>
          </ChatContainer>
        </ChatProvider>
      </section>
    </main>
  </div>
</template>
