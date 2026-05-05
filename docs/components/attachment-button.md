<script setup>
import Basic from '../examples/attachment-button/Basic.vue'
</script>

# AttachmentButton

`AttachmentButton` 封装文件选择按钮，用于在输入框中添加附件入口。

## 基础用法

<Basic />

## API

| 事件     | 类型                        | 说明               |
| -------- | --------------------------- | ------------------ |
| `attach` | `(files: FileList) => void` | 用户选择文件后触发 |

## 注意事项

组件只负责选择文件，不负责上传和文件预览。
