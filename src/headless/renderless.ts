/**
 * 无渲染组件只暴露状态与行为，由业务侧通过作用域插槽决定 DOM 结构。
 */

import { defineComponent, toRef, type PropType } from 'vue'
import { useHeadlessBubble }             from './useHeadlessBubble'
import { useHeadlessSender }             from './useHeadlessSender'
import { useHeadlessBubbleList }         from './useHeadlessBubbleList'
import { useHeadlessConversationList }   from './useHeadlessConversationList'
import { useHeadlessThinking }           from './useHeadlessThinking'
import { useHeadlessToolCall }           from './useHeadlessThinking'
import { useHeadlessArtifact }           from './useHeadlessThinking'
import { useHeadlessWelcome }            from './useHeadlessThinking'
import { useHeadlessCodeBlock }          from './useHeadlessThinking'
import type { Message, ThinkingStep, ToolCall, Artifact } from '../types'

// ── HeadlessBubble ───────────────────────────────────────────────────────────
export const HeadlessBubble = defineComponent({
  name: 'HeadlessBubble',
  props: {
    message:  { type: Object as PropType<Message>, required: true },
    onRetry:  { type: Function as PropType<() => void> },
    onDelete: { type: Function as PropType<() => void> },
    onEdit:   { type: Function as PropType<(c: string) => void> },
  },
  setup(props, { slots }) {
    const state = useHeadlessBubble({
      message:  props.message,
      onRetry:  props.onRetry,
      onDelete: props.onDelete,
      onEdit:   props.onEdit,
    })
    return () => slots.default?.(state) ?? null
  },
})

// ── HeadlessSender ───────────────────────────────────────────────────────────
export const HeadlessSender = defineComponent({
  name: 'HeadlessSender',
  props: {
    onSend:       { type: Function as PropType<(c: string) => void>, required: true },
    onStop:       { type: Function as PropType<() => void> },
    onAttach:     { type: Function as PropType<(f: FileList) => void> },
    isGenerating: { type: Boolean, default: false },
    maxLength:    { type: Number,  default: 32000 },
    placeholder:  { type: String,  default: 'Message…' },
  },
  setup(props, { slots }) {
    const state = useHeadlessSender({
      onSend:       props.onSend,
      onStop:       props.onStop,
      onAttach:     props.onAttach,
      isGenerating: props.isGenerating,
      maxLength:    props.maxLength,
      placeholder:  props.placeholder,
    })
    return () => slots.default?.(state) ?? null
  },
})

// ── HeadlessBubbleList ───────────────────────────────────────────────────────
export const HeadlessBubbleList = defineComponent({
  name: 'HeadlessBubbleList',
  props: {
    messages:        { type: Array as PropType<Message[]>, required: true },
    bottomThreshold: { type: Number, default: 80 },
  },
  setup(props, { slots }) {
    const messagesRef = toRef(props, 'messages')
    const state = useHeadlessBubbleList({ messages: messagesRef, bottomThreshold: props.bottomThreshold })
    return () => slots.default?.(state) ?? null
  },
})

// ── HeadlessConversationList ─────────────────────────────────────────────────
export const HeadlessConversationList = defineComponent({
  name: 'HeadlessConversationList',
  setup(_, { slots }) {
    const state = useHeadlessConversationList()
    return () => slots.default?.(state) ?? null
  },
})

// ── HeadlessThinking ─────────────────────────────────────────────────────────
export const HeadlessThinking = defineComponent({
  name: 'HeadlessThinking',
  props: {
    steps:           { type: Array as PropType<ThinkingStep[]>, required: true },
    defaultExpanded: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const stepsRef = toRef(props, 'steps')
    const state = useHeadlessThinking({ steps: stepsRef, defaultExpanded: props.defaultExpanded })
    return () => slots.default?.(state) ?? null
  },
})

// ── HeadlessToolCall ─────────────────────────────────────────────────────────
export const HeadlessToolCall = defineComponent({
  name: 'HeadlessToolCall',
  props: {
    toolCall:        { type: Object as PropType<ToolCall>, required: true },
    defaultExpanded: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const state = useHeadlessToolCall({ toolCall: props.toolCall, defaultExpanded: props.defaultExpanded })
    return () => slots.default?.(state) ?? null
  },
})

// ── HeadlessArtifact ─────────────────────────────────────────────────────────
export const HeadlessArtifact = defineComponent({
  name: 'HeadlessArtifact',
  props: {
    artifact: { type: Object as PropType<Artifact>, required: true },
    onUpdate: { type: Function as PropType<(c: string) => void> },
  },
  setup(props, { slots }) {
    const state = useHeadlessArtifact({ artifact: props.artifact, onUpdate: props.onUpdate })
    return () => slots.default?.(state) ?? null
  },
})

// ── HeadlessWelcome ──────────────────────────────────────────────────────────
export const HeadlessWelcome = defineComponent({
  name: 'HeadlessWelcome',
  props: {
    promptCards:  { type: Array as PropType<Array<{ icon?: string; title: string; prompt: string }>>, default: () => [] },
    suggestions:  { type: Array as PropType<string[]>, default: () => [] },
    onSelect:     { type: Function as PropType<(p: string) => void>, required: true },
  },
  setup(props, { slots }) {
    const state = useHeadlessWelcome({
      promptCards: props.promptCards,
      suggestions: props.suggestions,
      onSelect:    props.onSelect,
    })
    return () => slots.default?.(state) ?? null
  },
})

// ── HeadlessCodeBlock ────────────────────────────────────────────────────────
export const HeadlessCodeBlock = defineComponent({
  name: 'HeadlessCodeBlock',
  props: {
    code:        { type: String, required: true },
    language:    { type: String, default: 'text' },
    filename:    { type: String },
    collapsible: { type: Boolean, default: false },
    onRun:       { type: Function as PropType<(c: string) => void> },
  },
  setup(props, { slots }) {
    const state = useHeadlessCodeBlock({
      code:        props.code,
      language:    props.language,
      filename:    props.filename,
      collapsible: props.collapsible,
      onRun:       props.onRun,
    })
    return () => slots.default?.(state) ?? null
  },
})
