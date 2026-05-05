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
| `onRetry`        | `(id: string) => void` | `undefined` | 重试消息          |
| `onDelete`       | `(id: string) => void` | `undefined` | 删除消息          |

## 注意事项

外层容器需要提供高度，否则滚动区域无法形成。
