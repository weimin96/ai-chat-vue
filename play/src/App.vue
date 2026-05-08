<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArtifactPanel,
  BubbleList,
  ChatContainer,
  ChatProvider,
  MarkdownRenderer,
  Sender,
  Thinking,
  ToolCallCard,
  type Artifact,
  type Message,
  type StreamAdapter,
  type StreamChunk,
  type ThinkingStep,
  type ToolCall,
} from '@weimin96/ai-chat-vue'

type ScenarioId = 'chat' | 'messages' | 'sender' | 'standalone'

interface Scenario {
  id: ScenarioId
  title: string
  description: string
  group: string
}

const playConfig = {
  model: 'play-local',
  enableMarkdown: true,
  enableThinking: true,
  enableToolCalls: true,
  enableArtifacts: true,
  locale: 'zh-CN' as const,
}

const scenarios: Scenario[] = [
  {
    id: 'chat',
    title: '完整聊天',
    description: '验证容器、欢迎区、发送区、流式回复与滚动行为。',
    group: '组合场景',
  },
  {
    id: 'messages',
    title: '消息状态',
    description: '集中检查 Markdown、thinking、工具调用、错误和 artifact 展示。',
    group: '组合场景',
  },
  {
    id: 'sender',
    title: '输入区状态',
    description: '验证建议问题、生成中按钮、字数提示和窄屏排布。',
    group: '交互状态',
  },
  {
    id: 'standalone',
    title: '独立展示',
    description: '检查 Markdown、工具调用、思考过程和 artifact 的单独渲染。',
    group: '组件切片',
  },
]

const activeScenarioId = ref<ScenarioId>('chat')
const senderEvents = ref<string[]>(['等待输入区交互'])

const scenarioGroups = computed(() => {
  const groups = new Map<string, Scenario[]>()

  for (const scenario of scenarios) {
    const groupItems = groups.get(scenario.group) ?? []
    groupItems.push(scenario)
    groups.set(scenario.group, groupItems)
  }

  return Array.from(groups, ([title, items]) => ({ title, items }))
})

const activeScenario = computed(() => scenarios.find((scenario) => scenario.id === activeScenarioId.value) ?? scenarios[0])

const promptCards = [
  {
    title: '渲染巡检',
    icon: 'MD',
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
  '检查移动端输入区',
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

const sampleToolCalls: ToolCall[] = [
  {
    id: 'tool-running',
    name: 'search_docs',
    arguments: { keyword: 'BubbleList', limit: 3 },
    status: 'running',
  },
  {
    id: 'tool-success',
    name: 'read_component_state',
    arguments: { component: 'Sender' },
    status: 'success',
    result: { status: 'ok', matched: ['suggestions', 'isGenerating'] },
    durationMs: 126,
  },
  {
    id: 'tool-error',
    name: 'load_remote_theme',
    arguments: { theme: 'remote-preview' },
    status: 'error',
    error: '远程主题不可用，已回退到本地变量。',
    durationMs: 88,
  },
]

const thinkingSteps: ThinkingStep[] = [
  {
    id: 'thinking-layout',
    content: '先确认场景容器高度，避免消息列表和输入区互相挤压。',
    isComplete: true,
  },
  {
    id: 'thinking-stream',
    content: '再检查流式内容追加时滚动位置是否保持在底部。',
    isComplete: false,
  },
]

const sampleArtifact: Artifact = {
  id: 'artifact-layout',
  type: 'code',
  title: 'playground-layout.css',
  language: 'css',
  content: `.play-preview-frame {
  min-height: 0;
  overflow: hidden;
}`,
  version: 2,
  history: [
    {
      version: 1,
      content: '.play-preview-frame { overflow: auto; }',
      timestamp: Date.now() - 3600,
    },
  ],
}

const sampleMessages: Message[] = [
  {
    id: 'msg-user',
    role: 'user',
    content: '请检查消息状态在 playground 中是否稳定。',
    timestamp: Date.now() - 4200,
  },
  {
    id: 'msg-assistant-markdown',
    role: 'assistant',
    content: [
      '消息渲染状态用于集中验证复杂内容。',
      '',
      '- Markdown 列表',
      '- `inline code`',
      '- 代码块和长文本换行',
      '',
      '```ts',
      'const scenario = "messages"',
      '```',
    ].join('\n'),
    thinking: thinkingSteps,
    toolCalls: sampleToolCalls,
    artifacts: [sampleArtifact],
    timestamp: Date.now() - 3000,
  },
  {
    id: 'msg-assistant-streaming',
    role: 'assistant',
    content: '',
    timestamp: Date.now() - 1500,
    isStreaming: true,
  },
  {
    id: 'msg-assistant-error',
    role: 'assistant',
    content: '',
    timestamp: Date.now() - 800,
    isError: true,
    errorMessage: '模拟失败路径：适配器返回了错误 chunk。',
  },
]

const markdownSample = [
  '### Markdown 独立渲染',
  '',
  '用于检查正文、链接、引用、列表和代码块的间距。',
  '',
  '> 这段内容只用于 playground 视觉验证。',
  '',
  '```ts',
  "import { MarkdownRenderer } from '@weimin96/ai-chat-vue'",
  '```',
].join('\n')

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
      content: '- 当前页面是场景化 playground，不是组件清单镜像。\n',
    },
    {
      type: 'text',
      content: '- 组件通过 `@weimin96/ai-chat-vue` 导入，并由 alias 指向源码入口。\n',
    },
    {
      type: 'text',
      content: '- 修改 `src` 下的组件后，dev server 会直接热更新。\n\n',
    },
    {
      type: 'text',
      content: '```ts\nimport { ChatProvider, ChatContainer } from "@weimin96/ai-chat-vue"\n```\n',
    },
  ]
}

function delay(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

function selectScenario(id: ScenarioId) {
  activeScenarioId.value = id
}

function recordSenderSend(content: string) {
  senderEvents.value = [`发送内容：${content}`, ...senderEvents.value].slice(0, 3)
}

function recordSenderStop() {
  senderEvents.value = ['触发停止生成', ...senderEvents.value].slice(0, 3)
}
</script>

<template>
  <div class="play-shell">
    <aside class="play-sidebar" aria-label="Playground 场景">
      <div class="play-brand">
        <p class="play-eyebrow">本地组件实验台</p>
        <h1>@weimin96/ai-chat-vue</h1>
        <p class="play-summary">
          面向开发调试的组合验证入口，用于检查真实导出面、交互状态和响应式布局。
        </p>
      </div>

      <nav class="play-nav">
        <section
          v-for="group in scenarioGroups"
          :key="group.title"
          class="play-nav-group"
        >
          <h2>{{ group.title }}</h2>
          <button
            v-for="scenario in group.items"
            :key="scenario.id"
            type="button"
            :class="['play-nav-item', { 'is-active': activeScenarioId === scenario.id }]"
            @click="selectScenario(scenario.id)"
          >
            <span>{{ scenario.title }}</span>
            <small>{{ scenario.description }}</small>
          </button>
        </section>
      </nav>
    </aside>

    <main class="play-main">
      <header class="play-header">
        <div>
          <p class="play-eyebrow">Vite Play</p>
          <h2>{{ activeScenario.title }}</h2>
          <p>{{ activeScenario.description }}</p>
        </div>
        <span class="play-badge">源码 alias</span>
      </header>

      <section class="play-preview" :data-scenario="activeScenarioId">
        <div v-if="activeScenarioId === 'chat'" class="play-preview-frame play-chat-frame">
          <ChatProvider :config="playConfig" :adapter="playAdapter">
            <ChatContainer
              welcome-title="开始本地组件验证"
              welcome-subtitle="发送任意内容，play 会使用本地适配器模拟流式回复。"
              :prompt-cards="promptCards"
              :suggestions="suggestions"
              placeholder="输入一条测试消息"
              enable-markdown
            >
              <template #footer>本地演示数据仅用于组件交互验证。</template>
            </ChatContainer>
          </ChatProvider>
        </div>

        <div v-else-if="activeScenarioId === 'messages'" class="play-preview-frame play-message-frame">
          <BubbleList :messages="sampleMessages" enable-markdown />
        </div>

        <div v-else-if="activeScenarioId === 'sender'" class="play-preview-grid">
          <section class="play-panel">
            <h3>默认输入</h3>
            <Sender
              :suggestions="suggestions"
              placeholder="输入一条测试消息"
              @send="recordSenderSend"
              @stop="recordSenderStop"
            >
              <template #footer>默认状态验证建议问题和输入框排布。</template>
            </Sender>
          </section>

          <section class="play-panel">
            <h3>生成中</h3>
            <Sender
              is-generating
              placeholder="生成中可触发停止"
              @send="recordSenderSend"
              @stop="recordSenderStop"
            >
              <template #footer>生成状态验证按钮尺寸和位置稳定性。</template>
            </Sender>
          </section>

          <section class="play-panel play-panel-log">
            <h3>事件记录</h3>
            <ul>
              <li v-for="event in senderEvents" :key="event">{{ event }}</li>
            </ul>
          </section>
        </div>

        <div v-else class="play-preview-grid">
          <section class="play-panel">
            <h3>Markdown</h3>
            <MarkdownRenderer :content="markdownSample" />
          </section>

          <section class="play-panel">
            <h3>思考过程</h3>
            <Thinking :steps="thinkingSteps" />
          </section>

          <section class="play-panel">
            <h3>工具调用</h3>
            <ToolCallCard
              v-for="toolCall in sampleToolCalls"
              :key="toolCall.id"
              :tool-call="toolCall"
            />
          </section>

          <section class="play-panel play-panel-wide">
            <h3>Artifact</h3>
            <ArtifactPanel :artifact="sampleArtifact" />
          </section>
        </div>
      </section>
    </main>
  </div>
</template>
