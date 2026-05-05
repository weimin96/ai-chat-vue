import type {
  Artifact,
  Message,
  StreamAdapter,
  StreamChunk,
  ToolCall,
} from '@weimin96/ai-chat-vue'

export const sampleThinking = [
  {
    id: 'thinking-1',
    content: '识别用户目标：需要一个可复用的聊天界面。',
    isComplete: true,
  },
  {
    id: 'thinking-2',
    content: '组合消息气泡、输入框和 Markdown 渲染能力。',
    isComplete: true,
  },
]

export const sampleToolCall: ToolCall = {
  id: 'tool-1',
  name: 'search_knowledge',
  arguments: {
    query: 'Vue AI chat component',
    limit: 3,
  },
  status: 'success',
  result: {
    matches: ['流式回复', 'Markdown 渲染', '工具调用'],
  },
  durationMs: 128,
}

export const sampleArtifact: Artifact = {
  id: 'artifact-1',
  type: 'html',
  title: '状态卡片',
  content:
    '<div style="font-family:sans-serif;padding:24px"><h2>构建完成</h2><p>示例 Artifact 预览。</p></div>',
  version: 1,
  history: [],
}

export const sampleMessages: Message[] = [
  {
    id: 'message-1',
    role: 'user',
    content: '帮我总结这个组件库的核心能力。',
    timestamp: Date.now() - 120000,
  },
  {
    id: 'message-2',
    role: 'assistant',
    content:
      '它提供 **聊天容器**、**消息气泡**、**输入框** 和 `Markdown` 渲染能力。',
    thinking: sampleThinking,
    toolCalls: [sampleToolCall],
    artifacts: [sampleArtifact],
    timestamp: Date.now() - 60000,
  },
]

export const demoAdapter: StreamAdapter = {
  name: 'docs-local-adapter',
  async *stream(): AsyncIterable<StreamChunk> {
    const chunks: StreamChunk[] = [
      {
        type: 'thinking',
        content: '准备本地模拟回复，不会访问外部服务。',
      },
      {
        type: 'text',
        content: '这是一段来自文档站本地适配器的流式回复。\n\n',
      },
      {
        type: 'text',
        content: '- 支持 Markdown\n- 支持本地 mock 数据\n- 支持组件源码热更新',
      },
    ]

    for (const chunk of chunks) {
      await new Promise((resolve) => window.setTimeout(resolve, 160))
      yield chunk
    }
  },
}

export const promptCards = [
  {
    icon: 'AI',
    title: '生成摘要',
    prompt: '请用三句话总结组件库能力。',
  },
  {
    icon: 'UI',
    title: '检查界面',
    prompt: '请检查聊天界面的交互状态。',
  },
]

export const suggestions = ['解释组件职责', '展示 Markdown', '模拟流式输出']
