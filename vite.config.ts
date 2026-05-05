import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AiChatVue',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
      cssFileName: 'style',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Externalize all peer deps
      external: ['vue', 'marked', 'dompurify', 'shiki', 'mermaid'],
      output: {
        globals: {
          vue: 'Vue',
          marked: 'marked',
          dompurify: 'DOMPurify',
        },
        // Preserve CSS as separate file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name ?? 'asset'
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: false, // Keep readable for library dist
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})
