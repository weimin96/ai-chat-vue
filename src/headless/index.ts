/**
 * ============================================================
 * @ai-chat/vue — Headless Layer
 *
 * Headless composables expose ALL state + interaction logic
 * with ZERO CSS / class names. Users bring their own styles.
 *
 * Design contract:
 *   - Every composable returns a stable object (never arrays)
 *   - No DOM manipulation inside composables
 *   - All side-effects are opt-in via returned functions
 *   - ARIA attributes are returned as plain objects to spread
 * ============================================================
 */

export { useHeadlessBubble } from './useHeadlessBubble'
export { useHeadlessSender } from './useHeadlessSender'
export { useHeadlessBubbleList } from './useHeadlessBubbleList'
export { useHeadlessConversationList } from './useHeadlessConversationList'
export { useHeadlessThinking } from './useHeadlessThinking'
export { useHeadlessToolCall } from './useHeadlessToolCall'
export { useHeadlessArtifact } from './useHeadlessArtifact'
export { useHeadlessWelcome } from './useHeadlessWelcome'
export { useHeadlessCodeBlock } from './useHeadlessCodeBlock'
