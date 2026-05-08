<script setup>
import Basic from '../examples/sender/Basic.vue'
import source from '../examples/sender/Basic.vue?raw'
</script>

# Sender

`Sender` 是聊天输入框，支持建议项、附件、语音按钮、发送和停止生成状态。

## 导入方式

<ComponentImport name="Sender" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性                | 类型       | 默认值       | 说明         |
| ------------------- | ---------- | ------------ | ------------ |
| `value`             | `string`   | `undefined`  | 输入框受控值 |
| `disabled`          | `boolean`  | `false`      | 是否禁用     |
| `isGenerating`      | `boolean`  | `false`      | 是否生成中   |
| `placeholder`       | `string`   | `Message...` | 占位文本     |
| `ariaLabel`         | `string`   | `消息输入`   | 文本域可访问名称 |
| `enableVoice`       | `boolean`  | `false`      | 是否启用语音 |
| `enableAttachments` | `boolean`  | `false`      | 是否启用附件 |
| `suggestions`       | `string[]` | `undefined`  | 建议项       |
| `maxLength`         | `number`   | `32000`      | 最大输入长度 |

| 事件     | 说明     |
| -------- | -------- |
| `update:value` | 输入值变化 |
| `send`   | 发送消息 |
| `stop`   | 停止生成 |
| `attach` | 选择附件 |

| 插槽     | 说明         |
| -------- | ------------ |
| `footer` | 底部说明文案 |

## 双向绑定

```vue
<Sender v-model:value="draft" @send="sendMessage" />
```

`v-model:value` 可用于建议项填入、草稿恢复和外部清空。发送成功后组件会清空内部输入并同步触发 `update:value`。

## 可访问性

`placeholder` 只作为视觉提示，不能替代文本域名称。`Sender` 默认给 `<textarea>` 设置 `aria-label="消息输入"`，业务侧可通过 `ariaLabel` 覆盖。使用 Headless API 时，`useHeadlessSender().textareaAttrs` 已包含 `aria-label`、`aria-multiline` 和 `aria-describedby`。
