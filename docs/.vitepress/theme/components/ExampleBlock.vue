<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    source: string
    layout?: 'tabs' | 'split'
    previewLabel?: string
    codeLabel?: string
  }>(),
  {
    layout: 'tabs',
    previewLabel: '预览',
    codeLabel: '代码',
  }
)

const activePanel = ref<'preview' | 'code'>('preview')
const normalizedSource = computed(() => props.source.trim())
</script>

<template>
  <section class="docs-example" :class="`docs-example--${layout}`">
    <div v-if="layout === 'tabs'" class="docs-example__tabs" role="tablist">
      <button
        class="docs-example__tab"
        :class="{ 'docs-example__tab--active': activePanel === 'preview' }"
        type="button"
        role="tab"
        :aria-selected="activePanel === 'preview'"
        @click="activePanel = 'preview'"
      >
        {{ previewLabel }}
      </button>
      <button
        class="docs-example__tab"
        :class="{ 'docs-example__tab--active': activePanel === 'code' }"
        type="button"
        role="tab"
        :aria-selected="activePanel === 'code'"
        @click="activePanel = 'code'"
      >
        {{ codeLabel }}
      </button>
    </div>

    <div v-if="layout === 'split'" class="docs-example__split">
      <div class="docs-example__code docs-example__code--split">
        <pre><code>{{ normalizedSource }}</code></pre>
      </div>
      <div class="docs-example__preview">
        <slot />
      </div>
    </div>

    <template v-else>
      <div v-show="activePanel === 'preview'" class="docs-example__preview">
        <slot />
      </div>
      <div v-show="activePanel === 'code'" class="docs-example__code">
        <pre><code>{{ normalizedSource }}</code></pre>
      </div>
    </template>
  </section>
</template>
