<script setup lang="ts">
import { ArtifactPanel } from '@weimin96/ai-chat-vue'
import { sampleArtifact } from '../../.vitepress/theme/demo-data'
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview">
      <ArtifactPanel :artifact="sampleArtifact" />
    </div>
  </div>
</template>
