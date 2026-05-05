<script setup lang="ts">
import { computed, ref } from 'vue'

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

const commands: Record<PackageManager, string> = {
  npm: 'npm install @weimin96/ai-chat-vue',
  pnpm: 'pnpm add @weimin96/ai-chat-vue',
  yarn: 'yarn add @weimin96/ai-chat-vue',
  bun: 'bun add @weimin96/ai-chat-vue',
}

const managers = Object.keys(commands) as PackageManager[]
const activeManager = ref<PackageManager>('npm')
const activeCommand = computed(() => commands[activeManager.value])
</script>

<template>
  <section class="docs-package-tabs">
    <div class="docs-package-tabs__list" role="tablist" aria-label="包管理器">
      <button
        v-for="manager in managers"
        :key="manager"
        class="docs-package-tabs__tab"
        :class="{ 'docs-package-tabs__tab--active': activeManager === manager }"
        type="button"
        role="tab"
        :aria-selected="activeManager === manager"
        @click="activeManager = manager"
      >
        {{ manager }}
      </button>
    </div>
    <pre class="docs-package-tabs__code"><code>{{ activeCommand }}</code></pre>
  </section>
</template>
