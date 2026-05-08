<script setup>
import Basic from '../examples/markdown-renderer/Basic.vue'
import source from '../examples/markdown-renderer/Basic.vue?raw'
</script>

# MarkdownRenderer

`MarkdownRenderer` 渲染助手消息中的 Markdown 内容。

## 导入方式

<ComponentImport name="MarkdownRenderer" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性          | 类型      | 默认值 | 说明                 |
| ------------- | --------- | ------ | -------------------- |
| `content`     | `string`  | 必填   | Markdown 文本        |
| `isStreaming` | `boolean` | `false` | 是否处于流式输出     |
| `allowHtml`   | `boolean` | `false` | 是否允许 HTML        |
| `debounceMs`  | `number`  | `50`   | 流式期间解析合并间隔 |

## 注意事项

默认会转义 HTML。若业务允许 HTML，需要自行评估 XSS 风险。

当 `isStreaming=true` 时，组件会按 `debounceMs` 合并多次内容更新，减少高频 token 到来时的 Markdown 解析次数。流式结束或 `isStreaming=false` 时会立即解析当前完整内容。需要逐 token 调试时可将 `debounceMs` 设为 `0`。
