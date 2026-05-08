<script setup>
import Basic from '../examples/bubble-list/Basic.vue'
import source from '../examples/bubble-list/Basic.vue?raw'
</script>

# BubbleList

`BubbleList` 渲染消息数组，并在新增消息或流式输出时自动滚动到底部。

## 导入方式

<ComponentImport name="BubbleList" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性             | 类型                   | 默认值      | 说明              |
| ---------------- | ---------------------- | ----------- | ----------------- |
| `messages`       | `Message[]`            | 必填        | 消息列表          |
| `isGenerating`   | `boolean`              | `false`     | 是否生成中        |
| `enableMarkdown` | `boolean`              | `false`     | 是否启用 Markdown |
| `virtual`        | `boolean`              | `true`      | 是否启用虚拟滚动  |
| `virtualThreshold` | `number`             | `80`        | 触发虚拟滚动的消息数量 |
| `estimatedItemHeight` | `number`          | `96`        | 未测量消息的估算高度 |
| `virtualBuffer`  | `number`               | `6`         | 可视区域外的缓冲消息数量 |
| `onRetry`        | `(id: string) => void` | `undefined` | 重试消息          |
| `onDelete`       | `(id: string) => void` | `undefined` | 删除消息          |

## 注意事项

外层容器需要提供高度，否则滚动区域无法形成。

当 `messages.length > virtualThreshold` 且 `virtual !== false` 时，`BubbleList` 只渲染可视区域和缓冲区内的消息。组件会测量已渲染消息高度，未测量项使用 `estimatedItemHeight` 参与滚动占位计算。消息高度差异极大的场景可以调大 `virtualBuffer`，或传入 `virtual={false}` 关闭虚拟滚动。
