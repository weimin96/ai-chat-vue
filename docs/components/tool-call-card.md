<script setup>
import Basic from '../examples/tool-call-card/Basic.vue'
import source from '../examples/tool-call-card/Basic.vue?raw'
</script>

# ToolCallCard

`ToolCallCard` 展示工具调用名称、状态、参数、结果和错误信息。

## 导入方式

<ComponentImport name="ToolCallCard" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性       | 类型       | 默认值 | 说明         |
| ---------- | ---------- | ------ | ------------ |
| `toolCall` | `ToolCall` | 必填   | 工具调用对象 |

## 注意事项

参数和结果会以文本形式展示，敏感字段应在传入前脱敏。
