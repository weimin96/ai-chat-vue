// ============================================================
// useConversation - Conversation Management
// ============================================================
import { computed } from 'vue'
import { useChat } from './useChat'

export function useConversation() {
  const chat = useChat()

  const pinned = computed(() =>
    chat.conversations.value.filter(c => c.isPinned && !c.isArchived)
  )
  const recent = computed(() =>
    chat.conversations.value
      .filter(c => !c.isPinned && !c.isArchived)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  )
  const archived = computed(() =>
    chat.conversations.value.filter(c => c.isArchived)
  )

  function search(query: string) {
    const q = query.toLowerCase()
    return chat.conversations.value.filter(
      c => c.title.toLowerCase().includes(q) ||
           c.messages.some(m => m.content.toLowerCase().includes(q))
    )
  }

  function archive(id: string) {
    const conv = chat.conversations.value.find(c => c.id === id)
    if (conv) conv.isArchived = !conv.isArchived
  }

  return {
    pinned,
    recent,
    archived,
    search,
    archive,
    ...chat,
  }
}
