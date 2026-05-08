<script setup>
import Basic from '../examples/mermaid-block/Basic.vue'
import source from '../examples/mermaid-block/Basic.vue?raw'
</script>

# MermaidBlock

`MermaidBlock` 使用 Mermaid 渲染流程图、时序图等图表内容。

## 导入方式

<ComponentImport name="MermaidBlock" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性          | 类型      | 默认值      | 说明                 |
| ------------- | --------- | ----------- | -------------------- |
| `code`        | `string`  | 必填        | Mermaid 源码         |
| `id`          | `string`  | `undefined` | 渲染节点 ID 后缀     |
| `isStreaming` | `boolean` | `false`     | 是否处于流式输出阶段 |

## 注意事项

Mermaid 在客户端动态加载，SSR 阶段不会执行图表渲染。

`isStreaming=true` 时组件不会加载 Mermaid，也不会初始化图表实例，会直接展示 Mermaid 源码。流式完成后将 `isStreaming` 切回 `false`，组件才会渲染图表。Mermaid 模块加载后会复用初始化结果，避免消息内容更新时重复初始化。
