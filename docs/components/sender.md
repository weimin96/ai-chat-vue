<script setup>
import Basic from '../examples/sender/Basic.vue'
</script>

# Sender

`Sender` 是聊天输入框，支持建议项、附件、语音按钮、发送和停止生成状态。

## 基础用法

<Basic />

## API

| 属性                | 类型       | 默认值       | 说明         |
| ------------------- | ---------- | ------------ | ------------ |
| `disabled`          | `boolean`  | `false`      | 是否禁用     |
| `isGenerating`      | `boolean`  | `false`      | 是否生成中   |
| `placeholder`       | `string`   | `Message...` | 占位文本     |
| `enableVoice`       | `boolean`  | `false`      | 是否启用语音 |
| `enableAttachments` | `boolean`  | `false`      | 是否启用附件 |
| `suggestions`       | `string[]` | `undefined`  | 建议项       |
| `maxLength`         | `number`   | `32000`      | 最大输入长度 |

| 事件     | 说明     |
| -------- | -------- |
| `send`   | 发送消息 |
| `stop`   | 停止生成 |
| `attach` | 选择附件 |

| 插槽     | 说明         |
| -------- | ------------ |
| `footer` | 底部说明文案 |
