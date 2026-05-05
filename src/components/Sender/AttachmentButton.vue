<script setup lang="ts">
const emit = defineEmits<{ attach: [files: FileList] }>()

function handleFile(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files?.length) emit('attach', files)
}
</script>

<template>
  <label class="flex-shrink-0 p-1.5 rounded-lg text-[var(--ac-muted,#9ca3af)] hover:text-[var(--ac-primary,#6366f1)] cursor-pointer transition-colors self-end">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
    </svg>
    <input type="file" multiple class="hidden" @change="handleFile" />
  </label>
</template>
