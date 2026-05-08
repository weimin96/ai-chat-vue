<script setup>
import Basic from '../examples/bubble/Basic.vue'
import source from '../examples/bubble/Basic.vue?raw'
</script>

# Bubble

`Bubble` 渲染单条消息，自动处理用户与助手布局，并组合头像、推理过程、工具调用、Artifact 和消息操作。

## 导入方式

<ComponentImport name="Bubble" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性             | 类型                        | 默认值      | 说明                      |
| ---------------- | --------------------------- | ----------- | ------------------------- |
| `message`        | `Message`                   | 必填        | 消息对象                  |
| `showAvatar`     | `boolean`                   | `true`      | 是否显示头像              |
| `enableMarkdown` | `boolean`                   | `true`      | 助手消息是否渲染 Markdown |
| `onRetry`        | `() => void`                | `undefined` | 重试回调                  |
| `onEdit`         | `(content: string) => void` | `undefined` | 编辑回调                  |
| `onDelete`       | `() => void`                | `undefined` | 删除回调                  |

## 注意事项

复杂消息内容由子组件渲染，建议通过 `Message` 类型组织数据。

`onEdit` 会在用户消息的编辑按钮点击时触发，并把当前 `message.content` 传给调用方。`Bubble` 不内置弹窗、内联编辑或自动重新生成；如果业务需要“编辑后重新发送”，应在回调中更新输入框或会话状态，再由业务逻辑调用发送流程。
