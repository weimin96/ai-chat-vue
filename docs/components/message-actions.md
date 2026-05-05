<script setup>
import Basic from '../examples/message-actions/Basic.vue'
import source from '../examples/message-actions/Basic.vue?raw'
</script>

# MessageActions

`MessageActions` 提供复制、重试、编辑和删除等消息操作入口。

## 导入方式

<ComponentImport name="MessageActions" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性      | 类型      | 默认值 | 说明           |
| --------- | --------- | ------ | -------------- |
| `message` | `Message` | 必填   | 当前消息       |
| `isUser`  | `boolean` | 必填   | 是否为用户消息 |

| 事件     | 说明     |
| -------- | -------- |
| `retry`  | 触发重试 |
| `edit`   | 触发编辑 |
| `delete` | 触发删除 |

## 注意事项

复制行为依赖浏览器 Clipboard API。
