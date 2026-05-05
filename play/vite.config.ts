import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const projectRoot = resolve(__dirname, '..')

export default defineConfig({
  root: __dirname,
  plugins: [vue()],
  resolve: {
    alias: {
      '@weimin96/ai-chat-vue': resolve(projectRoot, 'src/index.ts'),
      '@': resolve(projectRoot, 'src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
})
