<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  getPreloadedShikiHighlighter,
  preloadShiki,
  resolveShikiLanguage,
} from './shiki'

const props = withDefaults(defineProps<{
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  collapsible?: boolean
  showRunButton?: boolean
}>(), {
  language: 'text',
  showLineNumbers: false,
  collapsible: false,
})

const emit = defineEmits<{ run: [code: string] }>()

const copied = ref(false)
const collapsed = ref(false)
const highlighted = ref('')
const highlightError = ref<string | null>(null)
const copyError = ref<string | null>(null)

let highlightVersion = 0

const lines = computed(() => props.code.split('\n'))
const normalizedLanguage = computed(() => resolveShikiLanguage(props.language))

async function refreshHighlight() {
  const version = ++highlightVersion
  const code = props.code
  const language = normalizedLanguage.value

  try {
    highlightError.value = null
    const highlighter =
      await getPreloadedShikiHighlighter()
      ?? await preloadShiki()

    if (version !== highlightVersion) return

    highlighted.value = highlighter.codeToHtml(code, {
      lang: language,
      theme: 'github-dark',
    })
  } catch (err: unknown) {
    if (version !== highlightVersion) return
    highlighted.value = ''
    highlightError.value = err instanceof Error ? err.message : '代码高亮失败'
  }
}

watch(
  () => [props.code, props.language] as const,
  () => { void refreshHighlight() },
  { immediate: true }
)

async function copy() {
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      throw new Error('当前环境不支持剪贴板')
    }
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    copyError.value = null
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err: unknown) {
    copyError.value = err instanceof Error ? err.message : '复制失败'
  }
}

const langColors: Record<string, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  java: '#ed8b00',
  go: '#00add8',
  rust: '#ce422b',
  vue: '#42b883',
  html: '#e34c26',
  css: '#264de4',
  json: '#292929',
  bash: '#89e051',
  sql: '#336791',
  markdown: '#083fa1',
}

const langColor = computed(() => langColors[normalizedLanguage.value] ?? '#6b7280')
</script>

<template>
  <div class="ac-codeblock rounded-xl overflow-hidden border border-[#2d2d3f] bg-[#1e1e2e] my-2">
    <div class="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#2d2d3f]">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-2 h-2 rounded-full flex-shrink-0" :style="`background: ${langColor}`" />
        <span class="text-xs font-mono text-[#a6adc8] truncate">
          {{ filename ?? normalizedLanguage }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="collapsible"
          type="button"
          @click="collapsed = !collapsed"
          class="text-[10px] text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
        >
          {{ collapsed ? '展开' : '收起' }}
        </button>

        <button
          v-if="showRunButton"
          type="button"
          @click="emit('run', code)"
          class="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] hover:bg-emerald-500/30 transition-colors"
        >
          运行
        </button>

        <button
          type="button"
          @click="copy"
          :class="[
            'flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors',
            copied ? 'text-emerald-400' : 'text-[#6c7086] hover:text-[#cdd6f4]',
          ]"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!copied" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
    </div>

    <div
      v-if="copyError || highlightError"
      class="px-4 py-1 text-[10px] text-red-300 bg-red-950/40 border-b border-red-900/60"
    >
      {{ copyError ?? highlightError }}
    </div>

    <div v-if="!collapsed" class="overflow-x-auto">
      <div v-if="highlighted" class="ac-codeblock-rendered min-w-max">
        <div v-if="showLineNumbers" class="flex">
          <div class="select-none px-4 py-4 text-right text-[#45475a] text-xs font-mono leading-relaxed">
            <span v-for="(_, i) in lines" :key="i" class="block">{{ i + 1 }}</span>
          </div>
          <div class="ac-codeblock-highlight flex-1" v-html="highlighted" />
        </div>
        <div v-else class="ac-codeblock-highlight" v-html="highlighted" />
      </div>

      <table v-else-if="showLineNumbers" class="w-full">
        <tbody>
          <tr v-for="(line, i) in lines" :key="i" class="hover:bg-white/5">
            <td class="select-none text-right pr-4 pl-4 py-0 text-[#45475a] text-xs font-mono w-8">{{ i + 1 }}</td>
            <td class="pr-4 py-0 text-[#cdd6f4] text-xs font-mono whitespace-pre">{{ line }}</td>
          </tr>
        </tbody>
      </table>
      <pre v-else class="p-4 text-[#cdd6f4] text-xs font-mono leading-relaxed"><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<style>
.ac-codeblock-highlight pre {
  margin: 0;
  padding: 1rem;
  background: transparent !important;
  font-size: 0.75rem;
  line-height: 1.625;
}

.ac-codeblock-highlight code {
  font-family: 'Fira Code', 'Cascadia Code', monospace;
}
</style>
