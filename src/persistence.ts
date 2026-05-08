import type { ChatPersistenceAdapter, Conversation } from './types'

export interface LocalStoragePersistenceOptions {
  key?: string
}

export function createLocalStoragePersistence(
  options: LocalStoragePersistenceOptions = {}
): ChatPersistenceAdapter {
  const key = options.key ?? 'ai-chat-vue:conversations'

  return {
    load() {
      const raw = localStorage.getItem(key)
      if (!raw) return []

      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        throw new Error('持久化数据格式无效')
      }

      return parsed as Conversation[]
    },
    save(conversations) {
      localStorage.setItem(key, JSON.stringify(conversations))
    },
  }
}
