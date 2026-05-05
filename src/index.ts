// ============================================================
// @ai-chat/vue - Main Entry Point
// ============================================================

// --- Styled Components ---
export { default as ChatProvider }      from './components/Chat/ChatProvider.vue'
export { default as ChatContainer }     from './components/Chat/ChatContainer.vue'
export { default as ConversationList }  from './components/Chat/ConversationList.vue'

export { default as Bubble }            from './components/Bubble/Bubble.vue'
export { default as BubbleList }        from './components/Bubble/BubbleList.vue'
export { default as MessageAvatar }     from './components/Bubble/MessageAvatar.vue'
export { default as MessageActions }    from './components/Bubble/MessageActions.vue'

export { default as Sender }            from './components/Sender/Sender.vue'
export { default as AttachmentButton }  from './components/Sender/AttachmentButton.vue'

export { default as Welcome }           from './components/Welcome/Welcome.vue'
export { default as PromptCards }       from './components/Welcome/PromptCards.vue'

export { default as Thinking }          from './components/Thinking/Thinking.vue'

export { default as MarkdownRenderer }  from './components/Markdown/MarkdownRenderer.vue'
export { default as CodeBlock }         from './components/CodeBlock/CodeBlock.vue'

export { default as ToolCallCard }      from './components/ToolCall/ToolCallCard.vue'
export { default as ArtifactPanel }     from './components/Artifact/ArtifactPanel.vue'
export { default as MermaidBlock }      from './components/Mermaid/MermaidBlock.vue'

// --- Headless Composables (logic only, zero styling) ---
export { useHeadlessBubble }            from './headless/useHeadlessBubble'
export { useHeadlessSender }            from './headless/useHeadlessSender'
export { useHeadlessBubbleList }        from './headless/useHeadlessBubbleList'
export { useHeadlessConversationList }  from './headless/useHeadlessConversationList'
export {
  useHeadlessThinking,
  useHeadlessToolCall,
  useHeadlessArtifact,
  useHeadlessWelcome,
  useHeadlessCodeBlock,
}                                       from './headless/useHeadlessThinking'

// --- Renderless Components ---
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
}                                       from './headless/renderless'

// --- Core Composables ---
export { useChat, provideChat }         from './composables/useChat'
export { useStream }                    from './composables/useStream'
export { useConversation }              from './composables/useConversation'
export { useToolCall, useArtifact }     from './composables/useToolCall'

// --- Adapters ---
export {
  createOpenAIAdapter,
  createOllamaAdapter,
  createCustomAdapter,
  createAISDKAdapter,
}                                       from './adapters/openai'

// --- Types ---
export type {
  Message,
  MessageRole,
  Conversation,
  ChatConfig,
  StreamAdapter,
  StreamChunk,
  ToolCall,
  Artifact,
  ArtifactType,
  ThinkingStep,
  Attachment,
}                                       from './types'
