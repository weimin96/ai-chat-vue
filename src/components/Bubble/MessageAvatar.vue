<!-- MessageAvatar.vue -->
<script setup lang="ts">
import type { MessageRole } from '../../types'

defineProps<{ role: MessageRole; src?: string; name?: string }>()
</script>

<template>
  <div class="ac-avatar flex-shrink-0">
    <img v-if="src" :src="src" :alt="name ?? role" class="w-8 h-8 rounded-full object-cover" />
    <div
      v-else-if="role === 'assistant'"
      class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm"
    >
      AI
    </div>
    <div
      v-else-if="role === 'user'"
      class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-sm"
    >
      U
    </div>
    <div
      v-else
      class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs"
    >
      🔧
    </div>
  </div>
</template>
