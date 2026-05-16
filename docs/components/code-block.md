<script setup>
import Basic from '../examples/code-block/Basic.vue'
import source from '../examples/code-block/Basic.vue?raw'
</script>

# CodeBlock

`CodeBlock` 展示代码片段，支持 Shiki 高亮、复制、行号、折叠和运行按钮。未安装 Shiki 或高亮加载失败时，会回退为纯文本展示。

## 导入方式

<ComponentImport name="CodeBlock" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性              | 类型      | 默认值      | 说明             |
| ----------------- | --------- | ----------- | ---------------- |
| `code`            | `string`  | 必填        | 代码内容         |
| `language`        | `string`  | `text`      | 语言名称         |
| `filename`        | `string`  | `undefined` | 文件名           |
| `showLineNumbers` | `boolean` | `false`     | 是否显示行号     |
| `collapsible`     | `boolean` | `false`     | 是否可折叠       |
| `showRunButton`   | `boolean` | `false`     | 是否显示运行按钮 |

| 事件  | 说明                       |
| ----- | -------------------------- |
| `run` | 点击运行按钮时返回代码内容 |

## Shiki 预加载

代码块会按需加载 Shiki。为了降低首次高亮延迟，可以在应用启动阶段调用 `preloadShiki()` 提前加载主题和语言包：

```ts
import { preloadShiki } from '@weimin96/ai-chat-vue'

void preloadShiki({
  themes: ['github-dark'],
  langs: ['typescript', 'vue', 'json', 'bash'],
})
```

`preloadShiki()` 会复用首次创建的加载 Promise，重复调用不会重复下载同一批核心资源。需要读取已启动的预加载任务时，可调用 `getPreloadedShikiHighlighter()`。组件会把未知语言回退为 `text`，避免把任意语言值直接交给高亮器。
