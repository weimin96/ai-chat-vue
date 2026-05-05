# @weimin96/ai-chat-vue

> **Powerful Vue 3 + TailwindCSS AI Chat UI Component Library**

A complete, production-ready component library for building AI chat interfaces — inspired by Ant Design X Vue, Element Plus X, and TDesign Chat.

## ✨ Features

| Category | Capabilities |
|----------|-------------|
| **Streaming** | Token streaming, incremental Markdown, typewriter effect, error recovery |
| **Messages** | User/assistant/system/tool roles, retry, edit, delete, feedback |
| **Thinking** | Collapsible reasoning panel, thought chain visualization |
| **Tool Calls** | Loading/success/error states, args display, result collapse, timing |
| **Artifacts** | HTML sandbox preview, Vue SFC, Markdown, JSON, Mermaid, version history |
| **Markdown** | GFM, tables, code blocks, blockquotes, task lists, safe links |
| **Code** | Syntax highlighting, copy, collapse, filename, line numbers |
| **Conversations** | List, search, pin, archive, rename, delete, export |
| **Input** | Multi-line, shortcuts, file upload, image paste, voice, template prompts |
| **Welcome** | Capability cards, prompt suggestions, onboarding |
| **Adapters** | OpenAI, Ollama, Vercel AI SDK, custom |
| **Theme** | CSS variables, dark mode, density config |
| **i18n** | zh-CN / en-US |

## 📦 Installation

```bash
npm install @weimin96/ai-chat-vue
```

Add to your Tailwind config:
```js
// tailwind.config.js
export default {
  content: ['./node_modules/@weimin96/ai-chat-vue/dist/**/*.js'],
  // ...
}
```

Import styles:
```js
import '@weimin96/ai-chat-vue/styles'
```

## 🚀 Quick Start

```vue
<script setup>
import { ChatProvider, ChatContainer, ConversationList, createOpenAIAdapter } from '@weimin96/ai-chat-vue'

const adapter = createOpenAIAdapter({ apiKey: import.meta.env.VITE_OPENAI_KEY })
</script>

<template>
  <ChatProvider :adapter="adapter" :config="{ model: 'gpt-4o', enableMarkdown: true }">
    <div class="flex h-screen">
      <ConversationList class="w-64" />
      <ChatContainer
        welcome-title="How can I help you today?"
        :prompt-cards="[
          { icon: '💡', title: 'Brainstorm ideas', prompt: 'Help me brainstorm ideas for...' },
          { icon: '📝', title: 'Write content', prompt: 'Write a blog post about...' },
        ]"
        :enable-voice="true"
        :enable-attachments="true"
      />
    </div>
  </ChatProvider>
</template>
```

## 🎨 Theming

Override CSS variables on `.ac-root` or `:root`:

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

/* Dark mode */
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

## 🔌 Adapters

### OpenAI / Compatible APIs
```js
import { createOpenAIAdapter } from '@weimin96/ai-chat-vue'

const adapter = createOpenAIAdapter({
  apiKey: 'sk-...',
  baseURL: 'https://api.openai.com/v1', // or any OpenAI-compatible endpoint
  model: 'gpt-4o',
})
```

### Ollama (local)
```js
import { createOllamaAdapter } from '@weimin96/ai-chat-vue'

const adapter = createOllamaAdapter({
  baseURL: 'http://localhost:11434',
  model: 'llama3.2',
})
```

### Custom
```js
import { createCustomAdapter } from '@weimin96/ai-chat-vue'

const adapter = createCustomAdapter(async function* (messages, config, signal) {
  // Yield StreamChunk objects
  yield { type: 'text', content: 'Hello!' }
  yield { type: 'done' }
})
```

## 📖 Component API

### `<ChatProvider>`
| Prop | Type | Description |
|------|------|-------------|
| `config` | `ChatConfig` | Global chat configuration |
| `adapter` | `StreamAdapter` | Streaming adapter |

### `<ChatContainer>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showWelcome` | `boolean` | `true` | Show welcome screen when empty |
| `welcomeTitle` | `string` | — | Welcome headline |
| `promptCards` | `PromptCard[]` | — | Quick-start prompt cards |
| `suggestions` | `string[]` | — | Suggested question chips |
| `enableVoice` | `boolean` | `false` | Enable voice input |
| `enableAttachments` | `boolean` | `false` | Enable file attachments |
| `enableMarkdown` | `boolean` | `true` | Render Markdown in messages |

### `<Bubble>`
| Prop | Type | Description |
|------|------|-------------|
| `message` | `Message` | The message object |
| `showAvatar` | `boolean` | Show role avatar |
| `enableMarkdown` | `boolean` | Render Markdown content |
| `onRetry` | `() => void` | Retry callback |
| `onDelete` | `() => void` | Delete callback |

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

## 🧩 Headless Mode (BYO Styles)

All logic is available **headless** — zero CSS, bring your own design system (Tailwind, UnoCSS, CSS Modules, plain CSS, whatever).

### Two ways to use headless

**1. Composables** — import the logic, build the template yourself:

```vue
<script setup>
import { useHeadlessSender } from '@weimin96/ai-chat-vue'
import { useChat } from '@weimin96/ai-chat-vue'

const { sendMessage, stopGeneration, isGenerating } = useChat()

const sender = useHeadlessSender({
  onSend: sendMessage,
  onStop: stopGeneration,
  isGenerating: isGenerating.value,
  placeholder: 'Ask anything…',
})
</script>

<template>
  <!-- 100% your own markup and classes -->
  <div class="my-input-wrapper">
    <textarea
      v-bind="sender.textareaAttrs"
      v-on="sender.textareaListeners"
      :ref="el => sender.textareaRef.value = el"
      :value="sender.value.value"
      class="my-textarea"
    />
    <span v-if="sender.isNearLimit.value" class="my-counter">
      {{ sender.remainingChars.value }} left
    </span>
    <button
      v-bind="sender.sendButtonAttrs"
      @click="sender.submit"
      class="my-send-btn"
      :class="{ 'my-send-btn--active': sender.canSubmit.value }"
    >
      {{ isGenerating ? 'Stop' : 'Send' }}
    </button>
  </div>
</template>
```

**2. Renderless components** — use scoped slots, same data via `v-slot`:

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
      <!-- Thinking panel -->
      <HeadlessThinking v-if="msg.thinking" :steps="msg.thinking" v-slot="think">
        <details :open="think.isExpanded.value" @toggle="think.toggle">
          <summary>
            {{ think.isComplete.value ? '✓ Reasoned' : '… Reasoning' }}
          </summary>
          <pre>{{ think.fullText.value }}</pre>
        </details>
      </HeadlessThinking>

      <!-- Tool calls -->
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

      <!-- Content -->
      <p>{{ bubble.displayContent }}</p>

      <!-- Actions -->
      <button v-bind="bubble.copyButtonAttrs" @click="bubble.copy">
        {{ bubble.hasCopied.value ? 'Copied!' : 'Copy' }}
      </button>
      <button v-bind="bubble.retryButtonAttrs" @click="bubble.retry">Retry</button>
    </article>
  </HeadlessBubble>
</template>
```

### Headless API Reference

#### `useHeadlessBubble(options)`
| Return | Type | Description |
|--------|------|-------------|
| `isUser / isAssistant / isTool / isSystem` | `boolean` | Role flags |
| `isStreaming / isError / isEmpty` | `boolean` | Content state |
| `displayContent` | `string` | Raw message text |
| `formattedTime` | `string` | Human-readable timestamp |
| `hasCopied` | `Readonly<Ref<boolean>>` | Copy feedback |
| `feedback` | `Readonly<Ref<'up'\|'down'\|null>>` | Thumbs state |
| `copy()` | `() => Promise<void>` | Copy to clipboard |
| `retry() / delete() / submitEdit()` | functions | Message actions |
| `rootAttrs / copyButtonAttrs / ...` | `Record<string,string>` | Spread ARIA attrs |

#### `useHeadlessSender(options)`
| Return | Type | Description |
|--------|------|-------------|
| `value` | `Ref<string>` | Textarea content |
| `canSubmit / isNearLimit / isOverLimit` | `ComputedRef<boolean>` | Submission state |
| `charCount / remainingChars` | `ComputedRef<number>` | Character counts |
| `isRecording` | `Readonly<Ref<boolean>>` | Voice recording |
| `submit() / clear() / insertText()` | functions | Input actions |
| `startVoice() / stopVoice()` | functions | Voice control |
| `textareaListeners` | `{ input, keydown, paste }` | Spread with `v-on` |
| `textareaAttrs / sendButtonAttrs / ...` | `Record<string,string>` | Spread with `v-bind` |
| `textareaRef` | `Ref<HTMLTextAreaElement\|null>` | Bind with `:ref` |

#### `useHeadlessBubbleList(options)`
| Return | Type | Description |
|--------|------|-------------|
| `listRef` | `Ref<HTMLElement\|null>` | Bind to scroll container |
| `isAtBottom / showScrollButton / isUserScrolled` | `Readonly<Ref<boolean>>` | Scroll state |
| `scrollToBottom(behavior?)` | function | Programmatic scroll |
| `resumeAutoScroll()` | function | Re-enable auto-scroll |
| `onScroll` | `() => void` | Bind to `@scroll` |
| `listAttrs / scrollButtonAttrs` | `Record<string,string>` | ARIA attrs |

#### `useHeadlessConversationList()`
| Return | Type | Description |
|--------|------|-------------|
| `searchQuery` | `Ref<string>` | Bind to search input |
| `pinnedConversations / recentConversations / searchResults` | `ComputedRef<Conversation[]>` | Grouped lists |
| `editingId / editTitle` | `Ref` | Inline rename state |
| `select / create / startRename / commitRename` | functions | CRUD actions |
| `pin / archive / remove / exportJSON` | functions | More actions |
| `handleListKeydown` | `(e: KeyboardEvent) => void` | Arrow-key navigation |
| `listAttrs / getItemAttrs(id) / searchAttrs` | objects | ARIA attrs |

#### `useHeadlessThinking(options)`
| Return | Type | Description |
|--------|------|-------------|
| `isExpanded` | `Readonly<Ref<boolean>>` | Panel open state |
| `isComplete` | `ComputedRef<boolean>` | All steps finished |
| `fullText` | `ComputedRef<string>` | Concatenated reasoning |
| `toggle / expand / collapse` | functions | Panel control |
| `toggleAttrs / panelAttrs` | objects | ARIA attrs |

#### `useHeadlessToolCall(options)`
| Return | Type | Description |
|--------|------|-------------|
| `isExpanded` | `Readonly<Ref<boolean>>` | Card open state |
| `isPending / isRunning / isSuccess / isError` | `boolean` | Status flags |
| `formattedArgs / formattedResult / formattedError` | `string` | Formatted text |
| `durationLabel` | `string\|null` | `"312ms"` or `"1.23s"` |
| `toggle` | function | Toggle expand |
| `toggleAttrs / panelAttrs` | objects | ARIA attrs |

#### `useHeadlessArtifact(options)`
| Return | Type | Description |
|--------|------|-------------|
| `activeTab` | `Ref<'preview'\|'source'>` | Current tab |
| `isPreview / isSource` | `ComputedRef<boolean>` | Tab flags |
| `isFullscreen` | `Readonly<Ref<boolean>>` | Fullscreen state |
| `blobUrl` | `ComputedRef<string\|null>` | HTML preview URL |
| `language / typeLabel / canPreview` | `ComputedRef<string\|boolean>` | Content metadata |
| `setTab / toggleFullscreen / updateContent / restoreVersion` | functions | Actions |
| `copySource() / hasCopied` | function + state | Source copy |
| `tabListAttrs / getTabAttrs(tab) / getPanelAttrs(tab)` | objects | ARIA attrs |
| `iframeAttrs` | object | Safe iframe attrs |

#### `useHeadlessCodeBlock(options)`
| Return | Type | Description |
|--------|------|-------------|
| `isCollapsed / hasCopied` | `Readonly<Ref<boolean>>` | UI state |
| `lines / lineCount` | `ComputedRef` | Parsed lines |
| `toggle / copy / run` | functions | Actions |
| `toggleAttrs / copyButtonAttrs / preAttrs` | objects | ARIA attrs |

