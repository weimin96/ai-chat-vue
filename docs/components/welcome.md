<script setup>
import Basic from '../examples/welcome/Basic.vue'
</script>

# Welcome

`Welcome` 渲染空会话欢迎页，可组合提示卡片或自定义内容。

## 基础用法

<Basic />

## API

| 属性           | 类型                                                          | 默认值                      | 说明        |
| -------------- | ------------------------------------------------------------- | --------------------------- | ----------- |
| `title`        | `string`                                                      | `How can I help you today?` | 标题        |
| `subtitle`     | `string`                                                      | `undefined`                 | 副标题      |
| `logo`         | `string`                                                      | `undefined`                 | 自定义 logo |
| `capabilities` | `Array<{ icon: string; title: string; description: string }>` | `undefined`                 | 能力卡片    |

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 欢迎页底部内容 |
