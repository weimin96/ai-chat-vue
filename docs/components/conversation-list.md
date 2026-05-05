<script setup>
import Basic from '../examples/conversation-list/Basic.vue'
</script>

# ConversationList

`ConversationList` 展示会话列表、置顶会话和最近会话，并提供新建、重命名、置顶、归档、删除和导出入口。

## 基础用法

<Basic />

## API

该组件不接收公开 Props，数据来自 `ChatProvider` 提供的聊天上下文。

| 操作     | 说明                                  |
| -------- | ------------------------------------- |
| 新建会话 | 调用上下文中的 `createConversation()` |
| 选择会话 | 调用 `setActive(id)`                  |
| 导出会话 | 生成 JSON 文件                        |

## 注意事项

`ConversationList` 适合侧栏布局，需要外层提供明确高度。
