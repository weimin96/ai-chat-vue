<script setup>
import Basic from '../examples/message-avatar/Basic.vue'
</script>

# MessageAvatar

`MessageAvatar` 根据消息角色渲染头像，支持自定义图片地址。

## 基础用法

<Basic />

## API

| 属性   | 类型          | 默认值      | 说明           |
| ------ | ------------- | ----------- | -------------- |
| `role` | `MessageRole` | 必填        | 消息角色       |
| `src`  | `string`      | `undefined` | 自定义头像图片 |
| `name` | `string`      | `undefined` | 头像替代文本   |

## 注意事项

未传入 `src` 时，组件会使用角色默认视觉样式。
