import { describe, expect, it } from 'vitest'

import { createLocalStoragePersistence } from './persistence'

class MemoryStorage implements Storage {
  private values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

describe('createLocalStoragePersistence', () => {
  it('SSR 环境没有 Storage 时返回空会话', () => {
    const persistence = createLocalStoragePersistence({ storage: null })

    expect(persistence.load()).toEqual([])
    expect(() => persistence.save([])).not.toThrow()
  })

  it('支持注入外部 Storage', () => {
    const storage = new MemoryStorage()
    const persistence = createLocalStoragePersistence({ key: 'chat', storage })

    persistence.save([
      {
        id: 'c1',
        title: '会话',
        messages: [],
        createdAt: 1,
        updatedAt: 1,
      },
    ])

    expect(persistence.load()).toEqual([
      {
        id: 'c1',
        title: '会话',
        messages: [],
        createdAt: 1,
        updatedAt: 1,
      },
    ])
  })

  it('遇到无效 JSON 时返回空会话', () => {
    const storage = new MemoryStorage()
    storage.setItem('chat', '{')
    const persistence = createLocalStoragePersistence({ key: 'chat', storage })

    expect(persistence.load()).toEqual([])
  })
})
