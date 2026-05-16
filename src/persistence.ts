import type { ChatPersistenceAdapter, Conversation } from './types'

export interface LocalStoragePersistenceOptions {
  key?: string
  storage?: Storage | null
}

function getStorage(storage?: Storage | null): Storage | null {
  if (storage !== undefined) return storage
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function createPersistenceError(message: string, cause: unknown) {
  const error = new Error(message) as Error & { cause?: unknown }
  error.cause = cause
  return error
}

export function createLocalStoragePersistence(
  options: LocalStoragePersistenceOptions = {}
): ChatPersistenceAdapter {
  const key = options.key ?? 'ai-chat-vue:conversations'

  return {
    load() {
      const storage = getStorage(options.storage)
      if (!storage) return []

      let raw: string | null
      try {
        raw = storage.getItem(key)
      } catch (err: unknown) {
        throw createPersistenceError('读取本地持久化失败', err)
      }

      if (!raw) return []

      try {
        const parsed: unknown = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed as Conversation[] : []
      } catch {
        return []
      }
    },
    save(conversations) {
      const storage = getStorage(options.storage)
      if (!storage) return

      try {
        storage.setItem(key, JSON.stringify(conversations))
      } catch (err: unknown) {
        throw createPersistenceError('保存本地持久化失败', err)
      }
    },
  }
}
