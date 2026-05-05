<script setup lang="ts">
import { ArtifactPanel } from '@weimin96/ai-chat-vue'
import { sampleArtifact } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <ArtifactPanel :artifact="sampleArtifact" />
</template>
