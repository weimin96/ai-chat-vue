import { defineConfig } from 'vitepress'
import { resolve } from 'path'

const projectRoot = resolve(__dirname, '../..')

export default defineConfig({
  title: '@ai-chat/vue',
  description: 'Vue 3 AI 聊天组件库文档',
  lang: 'zh-CN',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: '组件', link: '/components/chat-provider' },
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
        text: 'Chat',
        items: [
          { text: 'ChatProvider', link: '/components/chat-provider' },
          { text: 'ChatContainer', link: '/components/chat-container' },
          { text: 'ConversationList', link: '/components/conversation-list' },
        ],
      },
      {
        text: 'Bubble',
        items: [
          { text: 'Bubble', link: '/components/bubble' },
          { text: 'BubbleList', link: '/components/bubble-list' },
          { text: 'MessageAvatar', link: '/components/message-avatar' },
          { text: 'MessageActions', link: '/components/message-actions' },
        ],
      },
      {
        text: 'Input',
        items: [
          { text: 'Sender', link: '/components/sender' },
          { text: 'AttachmentButton', link: '/components/attachment-button' },
        ],
      },
      {
        text: 'Welcome',
        items: [
          { text: 'Welcome', link: '/components/welcome' },
          { text: 'PromptCards', link: '/components/prompt-cards' },
        ],
      },
      {
        text: 'Content',
        items: [
          { text: 'Thinking', link: '/components/thinking' },
          { text: 'MarkdownRenderer', link: '/components/markdown-renderer' },
          { text: 'CodeBlock', link: '/components/code-block' },
          { text: 'ToolCallCard', link: '/components/tool-call-card' },
          { text: 'ArtifactPanel', link: '/components/artifact-panel' },
          { text: 'MermaidBlock', link: '/components/mermaid-block' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com' }],
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
        '@ai-chat/vue': resolve(projectRoot, 'src/index.ts'),
        '@': resolve(projectRoot, 'src'),
      },
    },
    css: {
      postcss: resolve(projectRoot, 'docs/postcss.config.cjs'),
    },
  },
})
