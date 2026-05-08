<!-- Welcome.vue -->
<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  logo?: string
  capabilities?: Array<{ icon: string; title: string; description: string }>
}>()
const _emit = defineEmits<{ select: [prompt: string] }>()
</script>

<template>
  <div class="ac-welcome flex flex-col items-center justify-center min-h-full py-12 px-6 text-center">
    <div v-if="logo" class="mb-4">
      <img :src="logo" alt="logo" class="w-12 h-12 mx-auto rounded-xl" />
    </div>
    <div v-else class="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg">
      ✦
    </div>

    <h1 class="text-2xl font-bold text-[var(--ac-text,#111827)] mb-2">
      {{ title ?? 'How can I help you today?' }}
    </h1>
    <p v-if="subtitle" class="text-sm text-[var(--ac-muted,#6b7280)] mb-8 max-w-sm">{{ subtitle }}</p>

    <!-- Capability cards -->
    <div v-if="capabilities?.length" class="grid grid-cols-2 gap-3 max-w-lg w-full mb-8">
      <div
        v-for="cap in capabilities" :key="cap.title"
        class="p-3 bg-[var(--ac-surface,#f9fafb)] border border-[var(--ac-border,#e5e7eb)] rounded-xl text-left hover:border-[var(--ac-primary,#6366f1)] transition-colors cursor-pointer"
      >
        <div class="text-lg mb-1">{{ cap.icon }}</div>
        <p class="text-xs font-semibold text-[var(--ac-text,#1f2937)]">{{ cap.title }}</p>
        <p class="text-[11px] text-[var(--ac-muted,#6b7280)] mt-0.5">{{ cap.description }}</p>
      </div>
    </div>

    <slot />
  </div>
</template>
