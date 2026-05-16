import type { App, Component } from 'vue'
import ArtifactPanel from './components/Artifact/ArtifactPanel.vue'
import Bubble from './components/Bubble/Bubble.vue'
import BubbleList from './components/Bubble/BubbleList.vue'
import MessageActions from './components/Bubble/MessageActions.vue'
import MessageAvatar from './components/Bubble/MessageAvatar.vue'
import ChatContainer from './components/Chat/ChatContainer.vue'
import ChatProvider from './components/Chat/ChatProvider.vue'
import ConversationList from './components/Chat/ConversationList.vue'
import CodeBlock from './components/CodeBlock/CodeBlock.vue'
import MarkdownRenderer from './components/Markdown/MarkdownRenderer.vue'
import MermaidBlock from './components/Mermaid/MermaidBlock.vue'
import AttachmentButton from './components/Sender/AttachmentButton.vue'
import Sender from './components/Sender/Sender.vue'
import Thinking from './components/Thinking/Thinking.vue'
import ToolCallCard from './components/ToolCall/ToolCallCard.vue'
import PromptCards from './components/Welcome/PromptCards.vue'
import Welcome from './components/Welcome/Welcome.vue'

const styledComponents: Record<string, Component> = {
  ArtifactPanel,
  AttachmentButton,
  Bubble,
  BubbleList,
  ChatContainer,
  ChatProvider,
  CodeBlock,
  ConversationList,
  MarkdownRenderer,
  MermaidBlock,
  MessageActions,
  MessageAvatar,
  PromptCards,
  Sender,
  Thinking,
  ToolCallCard,
  Welcome,
}

export function install(app: App) {
  for (const [name, component] of Object.entries(styledComponents)) {
    app.component(name, component)
  }
}

export {
  ArtifactPanel,
  AttachmentButton,
  Bubble,
  BubbleList,
  ChatContainer,
  ChatProvider,
  CodeBlock,
  ConversationList,
  MarkdownRenderer,
  MermaidBlock,
  MessageActions,
  MessageAvatar,
  PromptCards,
  Sender,
  Thinking,
  ToolCallCard,
  Welcome,
}

export { useHeadlessBubble } from './headless/useHeadlessBubble'
export { useHeadlessSender } from './headless/useHeadlessSender'
export { useHeadlessBubbleList } from './headless/useHeadlessBubbleList'
export { useHeadlessConversationList } from './headless/useHeadlessConversationList'
export {
  useHeadlessThinking,
  useHeadlessToolCall,
  useHeadlessArtifact,
  useHeadlessWelcome,
  useHeadlessCodeBlock,
} from './headless/useHeadlessThinking'

export {
  HeadlessBubble,
  HeadlessSender,
  HeadlessBubbleList,
  HeadlessConversationList,
  HeadlessThinking,
  HeadlessToolCall,
  HeadlessArtifact,
  HeadlessWelcome,
  HeadlessCodeBlock,
} from './headless/renderless'

export { useChat, provideChat } from './composables/useChat'
export { useStream } from './composables/useStream'
export { useConversation } from './composables/useConversation'
export { useToolCall, useArtifact } from './composables/useToolCall'
export { parseNdjson, parseSSE, parseTextLines } from './utils/streamParsers'

export {
  createOpenAIAdapter,
  createOllamaAdapter,
  createCustomAdapter,
  createAISDKAdapter,
} from './adapters/openai'
export {
  preloadShiki,
  getPreloadedShikiHighlighter,
  type ShikiPreloadOptions,
} from './components/CodeBlock/shiki'
export {
  createLocalStoragePersistence,
  type LocalStoragePersistenceOptions,
} from './persistence'

export type {
  Message,
  MessageRole,
  Conversation,
  ConversationExportFormat,
  ChatConfig,
  StreamAdapter,
  StreamChunk,
  ChatPersistenceAdapter,
  ToolCall,
  Artifact,
  ArtifactType,
  ThinkingStep,
  Attachment,
} from './types'
