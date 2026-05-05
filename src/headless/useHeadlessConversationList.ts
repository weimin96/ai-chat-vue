/**
 * useHeadlessConversationList
 *
 * Conversation sidebar logic: search, grouping, CRUD, keyboard nav.
 * Zero styling.
 */
import { ref, computed, readonly } from 'vue'
import { useConversation } from '../composables/useConversation'
import type { Conversation } from '../types'

export interface UseHeadlessConversationListReturn {
  // Search
  searchQuery: ReturnType<typeof ref<string>>
  isSearching: ReturnType<typeof computed<boolean>>

  // Grouped lists
  pinnedConversations: ReturnType<typeof computed<Conversation[]>>
  recentConversations: ReturnType<typeof computed<Conversation[]>>
  archivedConversations: ReturnType<typeof computed<Conversation[]>>
  searchResults: ReturnType<typeof computed<Conversation[]>>
  isEmpty: ReturnType<typeof computed<boolean>>

  // Editing state
  editingId: ReturnType<typeof ref<string | null>>
  editTitle: ReturnType<typeof ref<string>>

  // Actions
  select: (id: string) => void
  create: () => void
  startRename: (conv: Conversation) => void
  commitRename: () => void
  cancelRename: () => void
  remove: (id: string) => void
  pin: (id: string) => void
  archive: (id: string) => void
  exportJSON: (id: string) => void

  // Keyboard nav
  focusedIndex: ReturnType<typeof ref<number>>
  handleListKeydown: (e: KeyboardEvent) => void

  // ARIA
  listAttrs: Record<string, string>
  getItemAttrs: (id: string) => Record<string, string | boolean>
  searchAttrs: Record<string, string>
  newButtonAttrs: Record<string, string>
}

export function useHeadlessConversationList(): UseHeadlessConversationListReturn {
  const conv = useConversation()

  const searchQuery = ref('')
  const editingId = ref<string | null>(null)
  const editTitle = ref('')
  const focusedIndex = ref(-1)

  const isSearching = computed(() => searchQuery.value.trim().length > 0)

  const searchResults = computed(() => {
    if (!isSearching.value) return []
    return conv.search(searchQuery.value)
  })

  const pinnedConversations = computed(() =>
    isSearching.value ? [] : conv.pinned.value
  )

  const recentConversations = computed(() =>
    isSearching.value ? [] : conv.recent.value
  )

  const archivedConversations = computed(() =>
    isSearching.value ? [] : conv.archived.value
  )

  const isEmpty = computed(
    () => !pinnedConversations.value.length &&
          !recentConversations.value.length &&
          !isSearching.value
  )

  function select(id: string) { conv.setActive(id) }

  function create() { conv.createConversation() }

  function startRename(c: Conversation) {
    editingId.value = c.id
    editTitle.value = c.title
  }

  function commitRename() {
    if (editingId.value && editTitle.value.trim()) {
      conv.renameConversation(editingId.value, editTitle.value.trim())
    }
    editingId.value = null
    editTitle.value = ''
  }

  function cancelRename() {
    editingId.value = null
    editTitle.value = ''
  }

  function remove(id: string) { conv.deleteConversation(id) }

  function pin(id: string) {
    const c = conv.conversations.value.find(x => x.id === id)
    if (c) conv.pinConversation(id, !c.isPinned)
  }

  function archive(id: string) { conv.archive(id) }

  function exportJSON(id: string) {
    const data = conv.exportConversation(id)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: `conversation-${id}.json` })
    a.click()
    URL.revokeObjectURL(url)
  }

  // Flat list for keyboard nav
  const flatList = computed(() => [
    ...pinnedConversations.value,
    ...recentConversations.value,
    ...(isSearching.value ? searchResults.value : []),
  ])

  function handleListKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusedIndex.value = Math.min(focusedIndex.value + 1, flatList.value.length - 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
    } else if (e.key === 'Enter' && focusedIndex.value >= 0) {
      select(flatList.value[focusedIndex.value].id)
    } else if (e.key === 'Escape') {
      focusedIndex.value = -1
    }
  }

  // ARIA
  const listAttrs: Record<string, string> = {
    role: 'navigation',
    'aria-label': 'Conversation list',
  }

  function getItemAttrs(id: string): Record<string, string | boolean> {
    return {
      role: 'button',
      tabindex: conv.activeId.value === id ? '0' : '-1',
      'aria-current': conv.activeId.value === id ? 'page' : 'false',
      'aria-selected': conv.activeId.value === id,
    }
  }

  const searchAttrs: Record<string, string> = {
    type: 'search',
    role: 'searchbox',
    'aria-label': 'Search conversations',
    autocomplete: 'off',
  }

  const newButtonAttrs: Record<string, string> = {
    type: 'button',
    'aria-label': 'New conversation',
  }

  return {
    searchQuery,
    isSearching,
    pinnedConversations,
    recentConversations,
    archivedConversations,
    searchResults,
    isEmpty,
    editingId,
    editTitle,
    select,
    create,
    startRename,
    commitRename,
    cancelRename,
    remove,
    pin,
    archive,
    exportJSON,
    focusedIndex,
    handleListKeydown,
    listAttrs,
    getItemAttrs,
    searchAttrs,
    newButtonAttrs,
  }
}
