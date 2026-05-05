<script setup>
import Basic from '../examples/chat-provider/Basic.vue'
import source from '../examples/chat-provider/Basic.vue?raw'
</script>

# ChatProvider

`ChatProvider` 提供聊天上下文、配置和流式适配器。所有依赖 `useChat()` 的组件都必须放在 Provider 内部。

## 导入方式

<ComponentImport name="ChatProvider" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性      | 类型                    | 默认值 | 说明                           |
| --------- | ----------------------- | ------ | ------------------------------ |
| `config`  | `ChatConfig`            | `{}`   | 会话模型、主题、功能开关等配置 |
| `adapter` | `StreamAdapter \| null` | `null` | 流式回复适配器                 |

| 插槽      | 说明                                            |
| --------- | ----------------------------------------------- |
| `default` | 放置 `ChatContainer` 或其他使用聊天上下文的组件 |

## 注意事项

未传入 `adapter` 时，用户消息可以进入会话，但不会产生助手流式回复。
