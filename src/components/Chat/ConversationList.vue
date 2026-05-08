<script setup lang="ts">
import { ref } from 'vue'
import { useConversation } from '../../composables/useConversation'
import type { Conversation } from '../../types'

const { pinned, recent, activeId, setActive, createConversation,
  deleteConversation, renameConversation, pinConversation, archive, exportConversation } = useConversation()

const searchQuery = ref('')
const editingId = ref<string | null>(null)
const editTitle = ref('')

function startEdit(conv: Conversation) {
  editingId.value = conv.id
  editTitle.value = conv.title
}
function commitEdit() {
  if (editingId.value) renameConversation(editingId.value, editTitle.value)
  editingId.value = null
}

function handleExport(id: string) {
  const data = exportConversation(id)
  const blob = new Blob([data], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'conversation.json'
  a.click()
}

function formatTime(ts: number) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="ac-conv-list flex flex-col h-full bg-[var(--ac-sidebar-bg,#f8f9fa)] border-r border-[var(--ac-border,#e5e7eb)]">
    <!-- 顶部操作区需要常驻，避免长列表滚动时新建入口消失。 -->
    <div class="p-3 border-b border-[var(--ac-border,#e5e7eb)]">
      <button
        @click="createConversation()"
        class="w-full flex items-center gap-2 px-3 py-2 bg-[var(--ac-primary,#4f46e5)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        New Conversation
      </button>
    </div>

    <!-- 搜索入口独立于列表，便于后续扩展分组过滤。 -->
    <div class="px-3 py-2">
      <div class="relative">
        <svg class="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[var(--ac-muted,#9ca3af)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchQuery"
          placeholder="Search..."
          class="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[var(--ac-border,#e5e7eb)] rounded-md outline-none focus:border-[var(--ac-primary,#4f46e5)] transition-colors"
        />
      </div>
    </div>

    <!-- 列表区域独立滚动，避免影响外层聊天布局高度。 -->
    <div class="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
      <!-- 置顶会话优先展示，保持高频会话的稳定位置。 -->
      <template v-if="pinned.length">
        <p class="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--ac-muted,#9ca3af)]">Pinned</p>
        <ConvItem
          v-for="conv in pinned" :key="conv.id"
          :conv="conv" :active="activeId === conv.id"
          :editing-id="editingId" :edit-title="editTitle"
          @select="setActive(conv.id)" @start-edit="startEdit" @commit-edit="commitEdit"
          @update-title="v => editTitle = v"
          @pin="pinConversation(conv.id, !conv.isPinned)"
          @archive="archive(conv.id)"
          @delete="deleteConversation(conv.id)"
          @export="handleExport(conv.id)"
          :format-time="formatTime"
        />
      </template>

      <!-- 最近会话保留默认时间顺序，降低用户回到上下文的成本。 -->
      <template v-if="recent.length">
        <p v-if="pinned.length" class="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--ac-muted,#9ca3af)] mt-2">Recent</p>
        <ConvItem
          v-for="conv in recent" :key="conv.id"
          :conv="conv" :active="activeId === conv.id"
          :editing-id="editingId" :edit-title="editTitle"
          @select="setActive(conv.id)" @start-edit="startEdit" @commit-edit="commitEdit"
          @update-title="v => editTitle = v"
          @pin="pinConversation(conv.id, !conv.isPinned)"
          @archive="archive(conv.id)"
          @delete="deleteConversation(conv.id)"
          @export="handleExport(conv.id)"
          :format-time="formatTime"
        />
      </template>

      <!-- 空状态只在无会话时出现，避免和过滤结果状态混淆。 -->
      <div v-if="!pinned.length && !recent.length" class="flex flex-col items-center justify-center py-12 text-center">
        <div class="text-3xl mb-2">💬</div>
        <p class="text-xs text-[var(--ac-muted,#9ca3af)]">No conversations yet</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, ref as vueRef } from 'vue'
const ConvItem = defineComponent({
  props: ['conv', 'active', 'editingId', 'editTitle', 'formatTime'],
  emits: ['select', 'start-edit', 'commit-edit', 'update-title', 'pin', 'archive', 'delete', 'export'],
  setup(props, { emit }) {
    const menuOpen = vueRef(false)
    return () => {
      const conv = props.conv
      const isActive = props.active
      const isEditing = props.editingId === conv.id
      return h('div', {
        class: `group relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm transition-colors ${isActive ? 'bg-[var(--ac-primary-light,#eef2ff)] text-[var(--ac-primary,#4f46e5)]' : 'hover:bg-white text-[var(--ac-text,#374151)]'}`,
        onClick: () => emit('select'),
      }, [
        h('div', { class: 'flex-1 min-w-0' }, [
          isEditing
            ? h('input', {
                value: props.editTitle,
                onInput: (e: Event) => emit('update-title', (e.target as HTMLInputElement).value),
                onBlur: () => emit('commit-edit'),
                onKeydown: (e: KeyboardEvent) => { if (e.key === 'Enter') emit('commit-edit') },
                onClick: (e: Event) => e.stopPropagation(),
                class: 'w-full text-xs bg-white border border-[var(--ac-primary,#4f46e5)] rounded px-1 py-0.5 outline-none',
                autofocus: true,
              })
            : h('p', { class: 'text-xs font-medium truncate' }, conv.title),
          h('p', { class: 'text-[10px] text-[var(--ac-muted,#9ca3af)] mt-0.5' }, props.formatTime(conv.updatedAt)),
        ]),
        h('div', {
          class: 'opacity-0 group-hover:opacity-100 transition-opacity',
          onClick: (e: Event) => { e.stopPropagation(); menuOpen.value = !menuOpen.value },
        }, [
          h('svg', { class: 'w-3.5 h-3.5 text-[var(--ac-muted,#9ca3af)]', fill: 'currentColor', viewBox: '0 0 20 20' }, [
            h('path', { d: 'M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z' }),
          ]),
        ]),
        menuOpen.value && h('div', {
          class: 'absolute right-0 top-8 z-50 w-36 bg-white rounded-lg shadow-lg border border-[var(--ac-border,#e5e7eb)] py-1 text-xs',
          onClick: (e: Event) => e.stopPropagation(),
        }, [
          ...[
            { label: 'Rename', action: () => { emit('start-edit', conv); menuOpen.value = false } },
            { label: conv.isPinned ? 'Unpin' : 'Pin', action: () => { emit('pin'); menuOpen.value = false } },
            { label: 'Archive', action: () => { emit('archive'); menuOpen.value = false } },
            { label: 'Export', action: () => { emit('export'); menuOpen.value = false } },
            { label: 'Delete', action: () => { emit('delete'); menuOpen.value = false }, class: 'text-red-500' },
          ].map(item => h('button', {
            class: `w-full text-left px-3 py-1.5 hover:bg-[var(--ac-hover,#f3f4f6)] transition-colors ${item.class ?? ''}`,
            onClick: item.action,
          }, item.label)),
        ]),
      ])
    }
  },
})
export default {}
</script>
