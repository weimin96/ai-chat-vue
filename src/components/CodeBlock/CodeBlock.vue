<script setup lang="ts">
import { ref, computed } from 'vue'

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

const lines = computed(() => props.code.split('\n'))

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const langColors: Record<string, string> = {
  javascript: '#f7df1e', typescript: '#3178c6', python: '#3776ab',
  java: '#ed8b00', go: '#00add8', rust: '#ce422b', vue: '#42b883',
  html: '#e34c26', css: '#264de4', json: '#292929', bash: '#89e051',
  sql: '#336791', markdown: '#083fa1',
}

const langColor = computed(() => langColors[props.language?.toLowerCase() ?? ''] ?? '#6b7280')
</script>

<template>
  <div class="ac-codeblock rounded-xl overflow-hidden border border-[#2d2d3f] bg-[#1e1e2e] my-2">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#2d2d3f]">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full" :style="`background: ${langColor}`" />
        <span class="text-xs font-mono text-[#a6adc8]">
          {{ filename ?? language }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <!-- Collapse -->
        <button
          v-if="collapsible"
          @click="collapsed = !collapsed"
          class="text-[10px] text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
        >
          {{ collapsed ? 'expand' : 'collapse' }}
        </button>

        <!-- Run -->
        <button
          v-if="showRunButton"
          @click="emit('run', code)"
          class="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] hover:bg-emerald-500/30 transition-colors"
        >
          ▶ Run
        </button>

        <!-- Copy -->
        <button
          @click="copy"
          :class="['flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors', copied ? 'text-emerald-400' : 'text-[#6c7086] hover:text-[#cdd6f4]']"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!copied" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <!-- Code body -->
    <div v-if="!collapsed" class="overflow-x-auto">
      <table v-if="showLineNumbers" class="w-full">
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
