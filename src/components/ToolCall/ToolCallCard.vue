<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ToolCall } from '../../types'

const props = defineProps<{ toolCall: ToolCall }>()

const expanded = ref(false)

const statusConfig = computed(() => ({
  pending: { icon: '⏳', color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
  running: { icon: '⚙️', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  success: { icon: '✅', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  error: { icon: '❌', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
}[props.toolCall.status]))

function formatArg(val: unknown): string {
  if (typeof val === 'string') return val
  return JSON.stringify(val, null, 2)
}
</script>

<template>
  <div :class="`ac-tool-call rounded-lg border ${statusConfig.border} ${statusConfig.bg} overflow-hidden my-1`">
    <button
      @click="expanded = !expanded"
      :aria-expanded="String(expanded)"
      :aria-controls="`tool-call-panel-${toolCall.id}`"
      class="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium"
    >
      <span class="text-sm">{{ statusConfig.icon }}</span>
      <span :class="`font-mono ${statusConfig.color}`">{{ toolCall.name }}</span>

      <!-- Running spinner -->
      <svg v-if="toolCall.status === 'running'" class="w-3 h-3 animate-spin text-blue-500 ml-0.5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>

      <span v-if="toolCall.durationMs" class="text-[10px] text-slate-400 ml-auto">{{ toolCall.durationMs }}ms</span>
      <svg :class="['w-3 h-3 ml-auto transition-transform', expanded ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <Transition name="slide">
      <div v-if="expanded" :id="`tool-call-panel-${toolCall.id}`" class="px-3 pb-3 space-y-2">
        <!-- Arguments -->
        <div v-if="Object.keys(toolCall.arguments).length">
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Arguments</p>
          <div class="space-y-1">
            <div v-for="(val, key) in toolCall.arguments" :key="key" class="flex gap-2 text-xs">
              <span class="font-mono text-slate-500 flex-shrink-0">{{ key }}:</span>
              <span class="font-mono text-slate-700 break-all">{{ formatArg(val) }}</span>
            </div>
          </div>
        </div>

        <!-- Result -->
        <div v-if="toolCall.result !== undefined">
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Result</p>
          <pre class="text-xs bg-white/60 rounded p-2 overflow-x-auto text-slate-700 font-mono">{{ typeof toolCall.result === 'string' ? toolCall.result : JSON.stringify(toolCall.result, null, 2) }}</pre>
        </div>

        <!-- Error -->
        <div v-if="toolCall.error" class="text-xs text-red-600 bg-red-100 rounded p-2 font-mono">
          {{ toolCall.error }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.15s; overflow: hidden; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
.slide-enter-to, .slide-leave-from { max-height: 400px; opacity: 1; }
</style>
