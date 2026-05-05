<script setup lang="ts">
import { provideChat } from '../../composables/useChat'
import type { ChatConfig, StreamAdapter } from '../../types'

const props = withDefaults(defineProps<{
  config?: ChatConfig
  adapter?: StreamAdapter | null
}>(), {
  config: () => ({}),
  adapter: null,
})

const chat = provideChat(props.config, props.adapter)

defineExpose({ chat })
</script>

<template>
  <slot />
</template>
