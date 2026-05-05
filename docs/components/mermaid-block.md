<script setup>
import Basic from '../examples/mermaid-block/Basic.vue'
</script>

# MermaidBlock

`MermaidBlock` 使用 Mermaid 渲染流程图、时序图等图表内容。

## 基础用法

<Basic />

## API

| 属性   | 类型     | 默认值      | 说明             |
| ------ | -------- | ----------- | ---------------- |
| `code` | `string` | 必填        | Mermaid 源码     |
| `id`   | `string` | `undefined` | 渲染节点 ID 后缀 |

## 注意事项

Mermaid 在客户端动态加载，SSR 阶段不会执行图表渲染。
