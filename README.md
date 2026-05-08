# ai-chat-vue（预览版）

<p align="center">
  <img src="docs/public/logo.svg" alt="@weimin96/ai-chat-vue logo" width="520">
</p>

> Vue 3 + TailwindCSS AI 聊天组件库

用于构建流式对话、消息列表、输入区、工具调用、产物预览和 Headless 组合能力的 Vue 组件库。

## 特性

| 分类 | 能力 |
|------|------|
| 流式回复 | Token 增量输出、错误状态、停止生成 |
| 消息 | 用户、助手、系统、工具角色，支持重试、编辑、删除和反馈 |
| 思考过程 | 可折叠推理面板和步骤展示 |
| 工具调用 | 参数、结果、状态和耗时展示 |
| 产物 | HTML 沙箱预览、Vue SFC、Markdown、JSON、Mermaid、版本历史 |
| Markdown | 基础 Markdown、代码块、引用、任务列表、安全链接 |
| 代码块 | 复制、折叠、文件名、行号 |
| 会话 | 列表、搜索、置顶、归档、重命名、删除、导出 |
| 输入 | 多行输入、快捷键、附件、图片粘贴、语音、建议项 |
| 主题 | CSS 变量、暗色模式、密度配置 |
| 国际化 | `zh-CN`、`en-US` |

## 在线演示

[https://ai-chat.wiblog.cn](https://ai-chat.wiblog.cn)

## 安装

```bash
npm install @weimin96/ai-chat-vue
```

加入 Tailwind 扫描路径：

```js
export default {
  content: ['./node_modules/@weimin96/ai-chat-vue/dist/**/*.js'],
}
```

引入样式：

```js
import '@weimin96/ai-chat-vue/styles'
```

Mermaid 和 Shiki 是可选 peer 依赖。只有使用 Mermaid 图表或自行接入 Shiki 高亮时才需要安装：

```bash
npm install mermaid shiki
```

## 快速开始

```vue
<script setup lang="ts">
import { ChatProvider, ChatContainer, ConversationList, createCustomAdapter } from '@weimin96/ai-chat-vue'

const adapter = createCustomAdapter(async function* (messages, config, signal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, config }),
  })

  if (!response.ok) {
    yield { type: 'error', error: '回复请求失败' }
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    yield { type: 'error', error: '响应体为空' }
    return
  }

  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    yield { type: 'text', content: decoder.decode(value, { stream: true }) }
  }

  yield { type: 'done' }
})
</script>

<template>
  <ChatProvider :adapter="adapter" :config="{ model: 'gpt-4o', enableMarkdown: true }">
    <div class="flex h-screen">
      <ConversationList class="w-64" />
      <ChatContainer
        welcome-title="需要处理什么问题？"
        :prompt-cards="[
          { title: '整理需求', prompt: '把下面内容整理成需求清单：' },
          { title: '生成摘要', prompt: '总结下面内容的关键结论：' },
        ]"
        :enable-voice="true"
        :enable-attachments="true"
      />
    </div>
  </ChatProvider>
</template>
```

真实 API Key 必须只放在服务端。前端通过 `/api/chat` 等后端代理接口调用模型服务，不要把 `VITE_OPENAI_KEY` 或 `sk-` 密钥写进浏览器 bundle。

## 主题

在 `.ac-root` 或 `:root` 覆盖 CSS 变量：

```css
:root {
  --ac-primary: #6366f1;
  --ac-primary-light: #eef2ff;
  --ac-bg: #ffffff;
  --ac-surface: #f9fafb;
  --ac-sidebar-bg: #f3f4f6;
  --ac-border: #e5e7eb;
  --ac-text: #111827;
  --ac-muted: #6b7280;
  --ac-user-bg: #6366f1;
  --ac-assistant-bg: #f3f4f6;
  --ac-hover: #f3f4f6;
  --ac-input-bg: #f9fafb;
}

[data-theme="dark"] {
  --ac-primary: #818cf8;
  --ac-bg: #0f172a;
  --ac-surface: #1e293b;
  --ac-sidebar-bg: #1e293b;
  --ac-border: #334155;
  --ac-text: #f1f5f9;
  --ac-muted: #94a3b8;
  --ac-user-bg: #4f46e5;
  --ac-assistant-bg: #1e293b;
  --ac-hover: #334155;
  --ac-input-bg: #1e293b;
}
```

## 适配器

### OpenAI 兼容接口

生产环境应由服务端保存密钥，并向前端暴露自己的代理接口。`createOpenAIAdapter` 需要传入 `apiKey`，不要在浏览器端用它承载真实密钥。

```ts
import { createCustomAdapter } from '@weimin96/ai-chat-vue'

const adapter = createCustomAdapter(async function* (messages, config, signal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, config }),
  })

  if (!response.ok) {
    yield { type: 'error', error: '模型服务不可用' }
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    yield { type: 'error', error: '模型服务没有返回流式内容' }
    return
  }

  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    yield { type: 'text', content: decoder.decode(value, { stream: true }) }
  }

  yield { type: 'done' }
})
```

### Ollama 本地服务

```js
import { createOllamaAdapter } from '@weimin96/ai-chat-vue'

const adapter = createOllamaAdapter({
  baseURL: 'http://localhost:11434',
  model: 'llama3.2',
})
```

### 自定义适配器

```ts
import { createCustomAdapter } from '@weimin96/ai-chat-vue'

const adapter = createCustomAdapter(async function* (messages, config, signal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, config }),
  })

  if (!response.ok) {
    yield { type: 'error', error: '请求失败' }
    return
  }

  yield { type: 'text', content: '你好。' }
  yield { type: 'done' }
})
```

`signal` 来自内部 `AbortController`，停止生成时会触发中断。自定义适配器中应把它传给 `fetch` 或其它可取消的请求实现。

`StreamChunk` 支持 `text`、`thinking`、`tool_call`、`tool_result`、`artifact`、`error`、`done`。中途失败时优先 `yield { type: 'error', error: '错误信息' }`，再结束生成。

当前没有内置断线重连机制，SSE 或网络中断后的重试策略由业务侧适配器负责。

## 组件 API

### `<ChatProvider>`
| 属性 | 类型 | 说明 |
|------|------|------|
| `config` | `ChatConfig` | 全局聊天配置 |
| `adapter` | `StreamAdapter` | 流式适配器 |

`ChatConfig` 字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `model` | `string` | 默认模型 |
| `systemPrompt` | `string` | 系统提示词，是否生效取决于适配器是否读取该字段 |
| `maxTokens` | `number` | 最大输出长度 |
| `temperature` | `number` | 采样温度 |
| `enableMarkdown` | `boolean` | 全局 Markdown 开关；当前 `ChatContainer.enableMarkdown` 会覆盖实际消息渲染 |
| `enableArtifacts` | `boolean` | 产物能力开关 |
| `enableThinking` | `boolean` | 思考过程开关 |
| `enableToolCalls` | `boolean` | 工具调用展示开关 |
| `enableVoice` | `boolean` | 语音输入开关 |
| `enableAttachments` | `boolean` | 附件开关 |
| `locale` | `'zh-CN' \| 'en-US'` | 默认语言 |
| `theme` | `'light' \| 'dark' \| 'auto'` | 主题 |
| `density` | `'compact' \| 'default' \| 'comfortable'` | 密度 |

### `<ChatContainer>`
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showWelcome` | `boolean` | `true` | 空会话时显示欢迎区 |
| `welcomeTitle` | `string` | 无 | 欢迎区标题 |
| `promptCards` | `PromptCard[]` | 无 | 建议卡片 |
| `suggestions` | `string[]` | 无 | 输入建议 |
| `enableVoice` | `boolean` | `false` | 启用语音输入 |
| `enableAttachments` | `boolean` | `false` | 启用附件 |
| `enableMarkdown` | `boolean` | `true` | 控制当前容器内消息是否渲染 Markdown，优先级高于 `ChatProvider.config.enableMarkdown` |

### `<Bubble>`
| 属性 | 类型 | 说明 |
|------|------|------|
| `message` | `Message` | 消息对象 |
| `showAvatar` | `boolean` | 是否显示头像 |
| `enableMarkdown` | `boolean` | 是否渲染 Markdown |
| `onRetry` | `() => void` | 重试回调 |
| `onEdit` | `(content: string) => void` | 编辑提交回调；组件只抛出内容，不会自动重新发送或触发新一轮流式回复 |
| `onDelete` | `() => void` | 删除回调 |

### `<BubbleList>`

| 属性 | 类型 | 说明 |
|------|------|------|
| `messages` | `Message[]` | 消息列表 |
| `isGenerating` | `boolean` | 是否正在生成 |
| `enableMarkdown` | `boolean` | 是否渲染 Markdown |
| `onRetry` | `(id: string) => void` | 按消息 id 重试 |
| `onDelete` | `(id: string) => void` | 按消息 id 删除 |

`BubbleList` 当前没有透传 `onEdit`。如需编辑消息，需要直接组合 `Bubble` 或使用 Headless API。

### `useChat()` composable
```ts
const {
  conversations,    // Ref<Conversation[]>
  activeId,         // Ref<string | null>
  messages,         // ComputedRef<Message[]>
  isGenerating,     // Ref<boolean>
  sendMessage,      // (content: string) => Promise<void>
  stopGeneration,   // () => void
  retryMessage,     // (id: string) => Promise<void>
  createConversation, deleteConversation, renameConversation,
  addMessage, updateMessage, deleteMessage,
  exportConversation,
} = useChat()
```

`addMessage` 和 `updateMessage` 会直接写入当前活动会话。流式回复期间，内部也会持续调用 `updateMessage` 追加助手内容；外部若同时更新同一条助手消息，应合并已有字段后再写入，避免覆盖流式内容。当前状态保存在内存中，刷新页面后不会自动恢复。

## 📁 Project Structure

```
@weimin96/ai-chat-vue
├─ components/
│  ├─ Chat/          ChatProvider, ChatContainer, ConversationList
│  ├─ Bubble/        Bubble, BubbleList, MessageAvatar, MessageActions
│  ├─ Sender/        Sender, PromptInput, AttachmentButton
│  ├─ Welcome/       Welcome, PromptCards, SuggestedQuestions
│  ├─ Thinking/      Thinking, ThoughtChain, ReasoningPanel
│  ├─ Markdown/      MarkdownRenderer
│  ├─ CodeBlock/     CodeBlock, CopyButton
│  ├─ ToolCall/      ToolCallCard, ToolResultCard
│  ├─ Artifact/      ArtifactPanel
│  └─ Mermaid/       MermaidBlock
├─ composables/
│  ├─ useChat        Core state management
│  ├─ useStream      SSE / streaming utilities
│  ├─ useConversation Conversation CRUD
│  ├─ useToolCall    Tool call state
│  └─ useArtifact   Artifact rendering
├─ adapters/
│  ├─ openai         OpenAI / compatible APIs
│  ├─ ollama         Ollama local models
│  ├─ ai-sdk         Vercel AI SDK
│  └─ custom         DIY adapter factory
└─ types.ts          Full TypeScript types
```

## License

MIT

---

## Headless 模式

所有核心交互都可以通过 Headless API 使用，不绑定样式系统。

### 使用方式

**组合式函数**

```vue
<script setup>
import { useHeadlessSender } from '@weimin96/ai-chat-vue'
import { useChat } from '@weimin96/ai-chat-vue'

const { sendMessage, stopGeneration, isGenerating } = useChat()

const sender = useHeadlessSender({
  onSend: sendMessage,
  onStop: stopGeneration,
  isGenerating: isGenerating.value,
  placeholder: '输入消息',
})
</script>

<template>
  <div class="my-input-wrapper">
    <textarea
      v-bind="sender.textareaAttrs"
      v-on="sender.textareaListeners"
      :ref="sender.textareaRef"
      :value="sender.value.value"
      class="my-textarea"
    />
    <span v-if="sender.isNearLimit.value" class="my-counter">
      剩余 {{ sender.remainingChars.value }}
    </span>
    <button
      v-bind="sender.sendButtonAttrs"
      @click="sender.submit"
      class="my-send-btn"
      :class="{ 'my-send-btn--active': sender.canSubmit.value }"
    >
      {{ isGenerating ? '停止' : '发送' }}
    </button>
  </div>
</template>
```

**无渲染组件**

```vue
<script setup>
import { HeadlessBubble, HeadlessToolCall, HeadlessThinking } from '@weimin96/ai-chat-vue'
</script>

<template>
  <HeadlessBubble :message="msg" v-slot="bubble">
    <article
      v-bind="bubble.rootAttrs"
      :class="bubble.isUser ? 'chat-bubble--user' : 'chat-bubble--ai'"
    >
      <HeadlessThinking v-if="msg.thinking" :steps="msg.thinking" v-slot="think">
        <details :open="think.isExpanded.value" @toggle="think.toggle">
          <summary>
            {{ think.isComplete.value ? '推理完成' : '推理中' }}
          </summary>
          <pre>{{ think.fullText.value }}</pre>
        </details>
      </HeadlessThinking>

      <HeadlessToolCall
        v-for="tc in msg.toolCalls" :key="tc.id"
        :tool-call="tc" v-slot="tool"
      >
        <div :class="`tool tool--${tc.status}`">
          <button v-bind="tool.toggleAttrs" @click="tool.toggle">
            {{ tc.name }}
            <span v-if="tool.durationLabel">{{ tool.durationLabel }}</span>
          </button>
          <div v-if="tool.isExpanded.value" v-bind="tool.panelAttrs">
            <pre>{{ tool.formattedArgs }}</pre>
            <pre v-if="tool.isSuccess">{{ tool.formattedResult }}</pre>
          </div>
        </div>
      </HeadlessToolCall>

      <p>{{ bubble.displayContent }}</p>

      <button v-bind="bubble.copyButtonAttrs" @click="bubble.copy">
        {{ bubble.hasCopied.value ? '已复制' : '复制' }}
      </button>
      <button v-bind="bubble.retryButtonAttrs" @click="bubble.retry">重试</button>
    </article>
  </HeadlessBubble>
</template>
```

### Headless API

#### `useHeadlessBubble(options)`

Options：

| 字段 | 类型 | 说明 |
|------|------|------|
| `message` | `Message` | 消息对象 |
| `onRetry` | `() => void` | 重试回调 |
| `onDelete` | `() => void` | 删除回调 |
| `onEdit` | `(content: string) => void` | 编辑提交回调 |
| `onCopy` | `() => void` | 复制成功回调 |

Return：

| 字段 | 类型 | 说明 |
|------|------|------|
| `isUser / isAssistant / isTool / isSystem` | `boolean` | 角色判断 |
| `isStreaming / isError / isEmpty` | `boolean` | 内容状态 |
| `displayContent` | `string` | 原始消息内容 |
| `formattedTime` | `string` | 基于当前运行环境 locale 的相对或短日期文本 |
| `hasCopied` | `Readonly<Ref<boolean>>` | 复制反馈 |
| `feedback` | `Readonly<Ref<'up'\|'down'\|null>>` | 反馈状态 |
| `copy()` | `() => Promise<void>` | 复制到剪贴板 |
| `retry() / delete() / submitEdit()` | functions | 消息操作 |
| `rootAttrs` | `Record<string,string>` | `role`、`aria-label`、`data-role`、`data-streaming`、`data-error` |
| `copyButtonAttrs` | `Record<string,string>` | `type`、`aria-label`、`aria-pressed` |
| `retryButtonAttrs` | `Record<string,string>` | `type`、`aria-label` |
| `deleteButtonAttrs` | `Record<string,string>` | `type`、`aria-label`、`aria-haspopup` |

#### `useHeadlessSender(options)`

Options：

| 字段 | 类型 | 说明 |
|------|------|------|
| `onSend` | `(content: string) => void \| Promise<void>` | 发送回调 |
| `onStop` | `() => void` | 停止生成回调 |
| `onAttach` | `(files: FileList) => void` | 附件回调 |
| `isGenerating` | `boolean` | 是否正在生成 |
| `maxLength` | `number` | 最大字符数，默认 `32000` |
| `placeholder` | `string` | 输入框占位文本 |

Return：

| 字段 | 类型 | 说明 |
|------|------|------|
| `value` | `Ref<string>` | 输入内容 |
| `canSubmit / isNearLimit / isOverLimit` | `ComputedRef<boolean>` | 提交状态 |
| `charCount / remainingChars` | `ComputedRef<number>` | 字符统计 |
| `isRecording` | `Readonly<Ref<boolean>>` | 语音状态 |
| `submit() / clear() / insertText()` | functions | 输入操作 |
| `startVoice() / stopVoice()` | functions | 语音控制 |
| `textareaListeners` | `{ input, keydown, paste }` | 传给 `v-on` |
| `textareaAttrs` | object | `placeholder`、`maxlength`、`rows`、`aria-label`、`aria-multiline`、`aria-describedby` |
| `sendButtonAttrs` | object | `type`、`aria-label`、`disabled` |
| `stopButtonAttrs` | object | `type`、`aria-label` |
| `voiceButtonAttrs` | object | `type`、`aria-label`、`aria-pressed` |
| `fileInputAttrs` | object | `type`、`multiple`、`aria-label` |
| `textareaRef` | `Ref<HTMLTextAreaElement\|null>` | 使用 `:ref="sender.textareaRef"` 绑定 |

#### `useHeadlessBubbleList(options)`
| 返回值 | 类型 | 说明 |
|--------|------|------|
| `listRef` | `Ref<HTMLElement\|null>` | 绑定滚动容器 |
| `isAtBottom / showScrollButton / isUserScrolled` | `Readonly<Ref<boolean>>` | 滚动状态 |
| `scrollToBottom(behavior?)` | function | 滚动到底部 |
| `resumeAutoScroll()` | function | 恢复自动滚动 |
| `onScroll` | `() => void` | 绑定 `@scroll` |
| `listAttrs` | `Record<string,string>` | `role`、`aria-live`、`aria-label` |
| `scrollButtonAttrs` | `Record<string,string>` | `type`、`aria-label` |

#### `useHeadlessConversationList()`
| 返回值 | 类型 | 说明 |
|--------|------|------|
| `searchQuery` | `Ref<string>` | 搜索输入值 |
| `pinnedConversations / recentConversations / searchResults` | `ComputedRef<Conversation[]>` | 分组列表 |
| `editingId / editTitle` | `Ref` | 内联重命名状态 |
| `select / create / startRename / commitRename` | functions | 会话操作 |
| `pin / archive / remove / exportJSON` | functions | 置顶、归档、删除和 JSON 导出 |
| `handleListKeydown` | `(e: KeyboardEvent) => void` | 键盘导航 |
| `listAttrs / getItemAttrs(id) / searchAttrs` | objects | ARIA 属性 |

#### `useHeadlessThinking(options)`
| 返回值 | 类型 | 说明 |
|--------|------|------|
| `isExpanded` | `Readonly<Ref<boolean>>` | 面板展开状态 |
| `isComplete` | `ComputedRef<boolean>` | 是否全部完成 |
| `fullText` | `ComputedRef<string>` | 合并后的推理文本 |
| `toggle / expand / collapse` | functions | 面板控制 |
| `toggleAttrs / panelAttrs` | objects | ARIA 属性 |

#### `useHeadlessToolCall(options)`
| 返回值 | 类型 | 说明 |
|--------|------|------|
| `isExpanded` | `Readonly<Ref<boolean>>` | 卡片展开状态 |
| `isPending / isRunning / isSuccess / isError` | `boolean` | 状态判断 |
| `formattedArgs / formattedResult / formattedError` | `string` | 格式化文本 |
| `durationLabel` | `string\|null` | 例如 `"312ms"` 或 `"1.23s"` |
| `toggle` | function | 切换展开状态 |
| `toggleAttrs` | object | 包含 `type`、`aria-expanded`、`aria-controls` |
| `panelAttrs` | object | 包含 `role`、`id` |

#### `useHeadlessArtifact(options)`
| 返回值 | 类型 | 说明 |
|--------|------|------|
| `activeTab` | `Ref<'preview'\|'source'>` | 当前标签 |
| `isPreview / isSource` | `ComputedRef<boolean>` | 标签状态 |
| `isFullscreen` | `Readonly<Ref<boolean>>` | 全屏状态 |
| `blobUrl` | `ComputedRef<string\|null>` | HTML 预览地址 |
| `language / typeLabel / canPreview` | `ComputedRef<string\|boolean>` | 内容元信息 |
| `setTab / toggleFullscreen / updateContent / restoreVersion` | functions | 产物操作 |
| `copySource() / hasCopied` | function + state | 复制源码 |
| `tabListAttrs / getTabAttrs(tab) / getPanelAttrs(tab)` | objects | ARIA 属性 |
| `iframeAttrs` | object | 安全 iframe 属性 |

#### `useHeadlessCodeBlock(options)`
| 返回值 | 类型 | 说明 |
|--------|------|------|
| `isCollapsed / hasCopied` | `Readonly<Ref<boolean>>` | 界面状态 |
| `lines / lineCount` | `ComputedRef` | 代码行 |
| `toggle / copy / run` | functions | 代码块操作 |
| `toggleAttrs / copyButtonAttrs / preAttrs` | objects | ARIA 属性 |

## 已知限制

| 范围 | 当前行为 |
|------|----------|
| 持久化 | 会话和消息只保存在内存中，库内暂未提供 localStorage 或 IndexedDB 适配器 |
| 长列表性能 | `BubbleList` 当前全量渲染消息，没有内置虚拟滚动 |
| 流式重连 | 网络中断后不自动重连，重试策略由适配器或业务层实现 |
| Mermaid | `MermaidBlock` 按需动态导入 `mermaid`，只在安装可选 peer 依赖后可用 |
| Shiki | 当前默认代码块不使用 Shiki，高亮能力需业务侧自行接入 |
| HTML 预览 | iframe sandbox 策略由组件内部控制，尚未公开白名单配置 |
| DOMPurify | Markdown 输出已净化，暂未公开 DOMPurify 自定义配置入口 |
