<script setup>
import Basic from '../examples/prompt-cards/Basic.vue'
import source from '../examples/prompt-cards/Basic.vue?raw'
</script>

# PromptCards

`PromptCards` 用卡片展示提示词，适合放在欢迎页中引导用户开始对话。

## 导入方式

<ComponentImport name="PromptCards" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性    | 类型                                                      | 默认值 | 说明         |
| ------- | --------------------------------------------------------- | ------ | ------------ |
| `cards` | `Array<{ icon?: string; title: string; prompt: string }>` | 必填   | 提示卡片列表 |

| 事件     | 说明                  |
| -------- | --------------------- |
| `select` | 选择卡片时返回 prompt |
