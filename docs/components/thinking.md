<script setup>
import Basic from '../examples/thinking/Basic.vue'
</script>

# Thinking

`Thinking` 展示模型推理过程，支持折叠和展开。

## 基础用法

<Basic />

## API

| 属性        | 类型             | 默认值  | 说明         |
| ----------- | ---------------- | ------- | ------------ |
| `steps`     | `ThinkingStep[]` | 必填    | 推理步骤     |
| `collapsed` | `boolean`        | `false` | 初始是否折叠 |

## 注意事项

推理内容可能包含敏感或内部信息，生产环境应根据产品策略决定是否展示。
