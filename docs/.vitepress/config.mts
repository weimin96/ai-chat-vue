import { defineConfig } from 'vitepress'
import { resolve } from 'path'

const projectRoot = resolve(__dirname, '../..')

export default defineConfig({
  title: '@weimin96/ai-chat-vue',
  description: 'Vue 3 AI 聊天组件库文档',
  lang: 'zh-CN',
  base: '/',
  head: [['link', { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' }]],
  cleanUrls: true,
  themeConfig: {
    logo: '/icon.svg',
    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: '组件', link: '/components/overview' },
      { text: 'Playground', link: '/playground' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '安装', link: '/guide/installation' },
          { text: '快速开始', link: '/guide/quick-start' },
          { text: '主题', link: '/guide/theme' },
        ],
      },
      {
        text: '组件',
        items: [{ text: 'Overview 组件总览', link: '/components/overview' }],
      },
      {
        text: 'Chat 会话',
        items: [
          {
            text: 'ChatProvider 聊天上下文',
            link: '/components/chat-provider',
          },
          {
            text: 'ChatContainer 聊天容器',
            link: '/components/chat-container',
          },
          {
            text: 'ConversationList 会话列表',
            link: '/components/conversation-list',
          },
        ],
      },
      {
        text: 'Bubble 消息',
        items: [
          { text: 'Bubble 消息气泡', link: '/components/bubble' },
          { text: 'BubbleList 消息列表', link: '/components/bubble-list' },
          {
            text: 'MessageAvatar 消息头像',
            link: '/components/message-avatar',
          },
          {
            text: 'MessageActions 消息操作',
            link: '/components/message-actions',
          },
        ],
      },
      {
        text: 'Input 输入',
        items: [
          { text: 'Sender 输入框', link: '/components/sender' },
          {
            text: 'AttachmentButton 附件按钮',
            link: '/components/attachment-button',
          },
        ],
      },
      {
        text: 'Welcome 引导',
        items: [
          { text: 'Welcome 欢迎页', link: '/components/welcome' },
          { text: 'PromptCards 提示卡片', link: '/components/prompt-cards' },
        ],
      },
      {
        text: 'Content 内容',
        items: [
          { text: 'Thinking 思考过程', link: '/components/thinking' },
          {
            text: 'MarkdownRenderer Markdown 渲染',
            link: '/components/markdown-renderer',
          },
          { text: 'CodeBlock 代码块', link: '/components/code-block' },
          {
            text: 'ToolCallCard 工具调用卡片',
            link: '/components/tool-call-card',
          },
          {
            text: 'ArtifactPanel Artifact 面板',
            link: '/components/artifact-panel',
          },
          {
            text: 'MermaidBlock Mermaid 图表',
            link: '/components/mermaid-block',
          },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/weimin96/ai-chat-vue' },
    ],
    outline: {
      label: '本页目录',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    search: {
      provider: 'local',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@weimin96/ai-chat-vue': resolve(projectRoot, 'src/index.ts'),
        '@': resolve(projectRoot, 'src'),
      },
    },
    css: {
      postcss: resolve(projectRoot, 'docs/postcss.config.cjs'),
    },
  },
})
