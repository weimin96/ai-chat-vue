<script setup lang="ts">
defineProps<{
  cards: Array<{ icon?: string; title: string; prompt: string; category?: string }>
  columns?: number
}>()
const emit = defineEmits<{ select: [prompt: string] }>()
</script>

<template>
  <div :style="`display:grid;gap:8px;width:100%;max-width:480px;grid-template-columns:repeat(${columns ?? 2},1fr)`">
    <button
      v-for="card in cards" :key="card.title"
      @click="emit('select', card.prompt)"
      class="ac-prompt-card group p-3 bg-white border border-[var(--ac-border,#e5e7eb)] rounded-xl text-left hover:border-[var(--ac-primary,#4f46e5)] hover:shadow-sm transition-all"
    >
      <span v-if="card.icon" class="text-base block mb-1">{{ card.icon }}</span>
      <p class="text-xs font-medium text-[var(--ac-text,#1f2937)] group-hover:text-[var(--ac-primary,#4f46e5)] transition-colors">{{ card.title }}</p>
      <p class="text-[10px] text-[var(--ac-muted,#9ca3af)] mt-0.5 line-clamp-2">{{ card.prompt }}</p>
    </button>
  </div>
</template>
