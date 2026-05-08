<script setup>
import Basic from '../examples/conversation-list/Basic.vue'
import source from '../examples/conversation-list/Basic.vue?raw'
</script>

# ConversationList

`ConversationList` 展示会话列表、置顶会话和最近会话，并提供新建、重命名、置顶、归档、删除和导出入口。

## 导入方式

<ComponentImport name="ConversationList" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

数据来自 `ChatProvider` 提供的聊天上下文。

| 属性 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `showCreateButton` | `boolean` | `true` | 是否显示新建会话按钮 |
| `showSearch` | `boolean` | `true` | 是否显示搜索框 |
| `emptyText` | `string` | `暂无会话` | 空状态文案 |

| 操作     | 说明                                  |
| -------- | ------------------------------------- |
| 新建会话 | 调用上下文中的 `createConversation()` |
| 选择会话 | 调用 `setActive(id)`                  |
| 导出会话 | 生成 JSON 文件                        |

## 注意事项

`ConversationList` 适合侧栏布局，需要外层提供明确高度。
