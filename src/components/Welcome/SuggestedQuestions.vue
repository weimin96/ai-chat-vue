<script setup lang="ts">
defineProps<{ questions: string[] }>()
const emit = defineEmits<{ select: [q: string] }>()
</script>

<template>
  <div class="ac-suggestions flex flex-col gap-1.5 w-full max-w-sm">
    <button
      v-for="q in questions" :key="q"
      @click="emit('select', q)"
      class="flex items-center gap-2 px-3 py-2 bg-white border border-[var(--ac-border,#e5e7eb)] rounded-lg text-left text-xs text-[var(--ac-text,#374151)] hover:border-[var(--ac-primary,#4f46e5)] hover:text-[var(--ac-primary,#4f46e5)] transition-all group"
    >
      <svg class="w-3 h-3 text-[var(--ac-muted,#9ca3af)] group-hover:text-[var(--ac-primary,#4f46e5)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
      {{ q }}
    </button>
  </div>
</template>
