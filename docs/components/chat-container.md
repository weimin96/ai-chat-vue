<script setup>
import Basic from '../examples/chat-container/Basic.vue'
import source from '../examples/chat-container/Basic.vue?raw'
</script>

# ChatContainer

`ChatContainer` 组合欢迎页、消息列表和输入框，适合作为完整聊天界面的主体。

## 导入方式

<ComponentImport name="ChatContainer" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性                | 类型                                                      | 默认值      | 说明                   |
| ------------------- | --------------------------------------------------------- | ----------- | ---------------------- |
| `showWelcome`       | `boolean`                                                 | `true`      | 空会话时是否展示欢迎页 |
| `welcomeTitle`      | `string`                                                  | `undefined` | 欢迎页标题             |
| `welcomeSubtitle`   | `string`                                                  | `undefined` | 欢迎页副标题           |
| `promptCards`       | `Array<{ icon?: string; title: string; prompt: string }>` | `undefined` | 欢迎页提示卡片         |
| `suggestions`       | `string[]`                                                | `undefined` | 输入框建议项           |
| `placeholder`       | `string`                                                  | `undefined` | 输入框占位文本         |
| `enableVoice`       | `boolean`                                                 | `false`     | 是否启用语音按钮       |
| `enableAttachments` | `boolean`                                                 | `false`     | 是否启用附件按钮       |
| `enableMarkdown`    | `boolean`                                                 | `undefined` | 是否渲染助手 Markdown  |

| 插槽     | 说明           |
| -------- | -------------- |
| `footer` | 输入框底部提示 |

## 注意事项

组件必须位于 `ChatProvider` 内部，否则无法访问聊天上下文。

`enableMarkdown` 的优先级为 `ChatContainer.enableMarkdown` 高于 `ChatProvider.config.enableMarkdown`。两者都未传入时默认启用 Markdown 渲染。
