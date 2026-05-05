import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ComponentImport from './components/ComponentImport.vue'
import ExampleBlock from './components/ExampleBlock.vue'
import PackageTabs from './components/PackageTabs.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ComponentImport', ComponentImport)
    app.component('ExampleBlock', ExampleBlock)
    app.component('PackageTabs', PackageTabs)
  },
} satisfies Theme
