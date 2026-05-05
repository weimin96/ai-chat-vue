<script setup lang="ts">
import { MessageAvatar } from '@weimin96/ai-chat-vue'
</script>

<template>
  <div class="flex gap-4">
    <MessageAvatar role="user" name="User" />
    <MessageAvatar role="assistant" name="AI" />
    <MessageAvatar role="tool" name="Tool" />
  </div>
</template>
