<script setup>
import Basic from '../examples/code-block/Basic.vue'
</script>

# CodeBlock

`CodeBlock` 展示代码片段，支持复制、行号、折叠和运行按钮。

## 基础用法

<Basic />

## API

| 属性              | 类型      | 默认值      | 说明             |
| ----------------- | --------- | ----------- | ---------------- |
| `code`            | `string`  | 必填        | 代码内容         |
| `language`        | `string`  | `text`      | 语言名称         |
| `filename`        | `string`  | `undefined` | 文件名           |
| `showLineNumbers` | `boolean` | `false`     | 是否显示行号     |
| `collapsible`     | `boolean` | `false`     | 是否可折叠       |
| `showRunButton`   | `boolean` | `false`     | 是否显示运行按钮 |

| 事件  | 说明                       |
| ----- | -------------------------- |
| `run` | 点击运行按钮时返回代码内容 |
