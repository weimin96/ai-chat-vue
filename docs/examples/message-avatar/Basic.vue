<script setup lang="ts">
import { MessageAvatar } from '@ai-chat/vue'
</script>

<template>
  <div class="demo-card">
    <div class="demo-card__preview flex gap-4">
      <MessageAvatar role="user" name="User" />
      <MessageAvatar role="assistant" name="AI" />
      <MessageAvatar role="tool" name="Tool" />
    </div>
  </div>
</template>
