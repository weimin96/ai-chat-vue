<!-- Thinking.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ThinkingStep } from '../../types'

const props = defineProps<{ steps: ThinkingStep[]; collapsed?: boolean }>()
const expanded = ref(!props.collapsed)
</script>

<template>
  <div class="ac-thinking w-full rounded-lg border border-violet-200 bg-violet-50/50 overflow-hidden mb-2">
    <button
      @click="expanded = !expanded"
      class="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-violet-700 hover:bg-violet-100/50 transition-colors"
    >
      <!-- Spinner when still thinking -->
      <svg
        v-if="steps[steps.length - 1]?.isComplete === false"
        class="w-3.5 h-3.5 animate-spin text-violet-500"
        fill="none" viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <svg v-else class="w-3.5 h-3.5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
      <span>Thinking{{ steps[steps.length - 1]?.isComplete === false ? '...' : ' (completed)' }}</span>
      <svg
        :class="['w-3 h-3 ml-auto transition-transform', expanded ? 'rotate-180' : '']"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <Transition name="slide">
      <div v-if="expanded" class="px-3 pb-2 space-y-1">
        <p
          v-for="step in steps" :key="step.id"
          class="text-xs text-violet-600/80 font-mono leading-relaxed"
        >
          {{ step.content }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
.slide-enter-to, .slide-leave-from { max-height: 500px; opacity: 1; }
</style>
