<script setup lang="ts">
import { computed } from 'vue'
import { useChat } from '../../composables/useChat'
import BubbleList from '../Bubble/BubbleList.vue'
import Sender from '../Sender/Sender.vue'
import Welcome from '../Welcome/Welcome.vue'
import PromptCards from '../Welcome/PromptCards.vue'

const props = withDefaults(defineProps<{
  showWelcome?: boolean
  welcomeTitle?: string
  welcomeSubtitle?: string
  promptCards?: Array<{ icon?: string; title: string; prompt: string }>
  suggestions?: string[]
  placeholder?: string
  enableVoice?: boolean
  enableAttachments?: boolean
  enableMarkdown?: boolean
}>(), {
  showWelcome: true,
})

const chat = useChat()
const { messages, isGenerating, sendMessage, stopGeneration, retryMessage, deleteMessage } = chat

const isEmpty = computed(() => messages.value.length === 0)
const resolvedEnableMarkdown = computed(() => props.enableMarkdown ?? chat.config.enableMarkdown ?? true)

async function handleSend(content: string) {
  await sendMessage(content)
}
</script>

<template>
  <div class="ac-container flex flex-col h-full bg-[var(--ac-bg,#ffffff)]">
    <!-- Messages or Welcome -->
    <div class="flex-1 overflow-hidden">
      <template v-if="isEmpty && showWelcome">
        <Welcome :title="welcomeTitle" :subtitle="welcomeSubtitle">
          <PromptCards
            v-if="promptCards?.length"
            :cards="promptCards"
            @select="handleSend"
          />
        </Welcome>
      </template>
      <template v-else>
        <BubbleList
          :messages="messages"
          :is-generating="isGenerating"
          :enable-markdown="resolvedEnableMarkdown"
          :on-retry="retryMessage"
          :on-delete="deleteMessage"
        />
      </template>
    </div>

    <!-- Input -->
    <Sender
      :is-generating="isGenerating"
      :suggestions="isEmpty ? suggestions : undefined"
      :placeholder="placeholder"
      :enable-voice="enableVoice"
      :enable-attachments="enableAttachments"
      @send="handleSend"
      @stop="stopGeneration"
    >
      <template #footer><slot name="footer" /></template>
    </Sender>
  </div>
</template>
