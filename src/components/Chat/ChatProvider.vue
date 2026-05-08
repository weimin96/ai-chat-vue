<script setup lang="ts">
import { provideChat } from '../../composables/useChat'
import type { ChatConfig, StreamAdapter, ChatPersistenceAdapter } from '../../types'

const props = withDefaults(defineProps<{
  config?: ChatConfig
  adapter?: StreamAdapter | null
  persistence?: ChatPersistenceAdapter | null
}>(), {
  config: () => ({}),
  adapter: null,
  persistence: null,
})

const chat = provideChat(props.config, props.adapter, props.persistence)

defineExpose({ chat })
</script>

<template>
  <slot />
</template>
