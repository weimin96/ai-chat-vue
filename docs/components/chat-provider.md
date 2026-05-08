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

## ChatConfig

| 字段                | 类型                                               | 默认行为                       | 说明                     |
| ------------------- | -------------------------------------------------- | ------------------------------ | ------------------------ |
| `model`             | `string`                                           | 由适配器决定                   | 当前会话使用的模型标识   |
| `systemPrompt`      | `string`                                           | 不注入系统提示词               | 发送给适配器的系统提示词 |
| `maxTokens`         | `number`                                           | 适配器默认值                   | 回复最大 token 数        |
| `temperature`       | `number`                                           | 适配器默认值                   | 采样温度                 |
| `enableMarkdown`    | `boolean`                                          | 组件按自身配置决定             | 是否启用 Markdown 渲染   |
| `enableArtifacts`   | `boolean`                                          | `false`                        | 是否启用 Artifact 能力   |
| `enableThinking`    | `boolean`                                          | `false`                        | 是否展示思考过程         |
| `enableToolCalls`   | `boolean`                                          | `false`                        | 是否展示工具调用         |
| `enableVoice`       | `boolean`                                          | `false`                        | 是否启用语音输入         |
| `enableAttachments` | `boolean`                                          | `false`                        | 是否启用附件入口         |
| `locale`            | `'zh-CN' \| 'en-US'`                               | 组件内置文案                   | 本地化语言               |
| `theme`             | `'light' \| 'dark' \| 'auto'`                      | 由样式变量决定                 | 主题模式                 |
| `density`           | `'compact' \| 'default' \| 'comfortable'`          | 组件默认间距                   | 信息密度                 |

`ChatConfig` 会原样传给 `StreamAdapter.stream(messages, config)`。组件只消费与自身相关的开关，模型、系统提示词、采样参数等由适配器决定如何映射到后端请求。

## 注意事项

未传入 `adapter` 时，用户消息可以进入会话，但不会产生助手流式回复。

`useChat()` 暴露的 `addMessage`、`updateMessage`、`deleteMessage` 是同步内存操作，不提供跨异步任务的写入锁。流式回复期间，内部会持续更新当前助手消息的 `content`、`thinking`、`toolCalls` 和 `artifacts`。外部代码可以新增独立消息或更新非流式消息；若同时更新正在流式生成的同一条助手消息，需要避免覆盖 `content`，或在业务层合并后一次性写入。
