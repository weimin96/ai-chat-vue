import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.web.json',
      outDirs: ['dist'],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AiChatVue',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
      cssFileName: 'style',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // 依赖由使用方项目解析，避免组件库包内重复打包运行时依赖。
      external: ['vue', 'marked', 'dompurify', 'shiki', 'mermaid'],
      output: {
        globals: {
          vue: 'Vue',
          marked: 'marked',
          dompurify: 'DOMPurify',
        },
        // 样式导出路径已经进入公开契约，构建时必须保持稳定文件名。
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name ?? 'asset'
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: false,
    minify: false,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})
