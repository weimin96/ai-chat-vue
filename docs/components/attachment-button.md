<script setup>
import Basic from '../examples/attachment-button/Basic.vue'
import source from '../examples/attachment-button/Basic.vue?raw'
</script>

# AttachmentButton

`AttachmentButton` 封装文件选择按钮，用于在输入框中添加附件入口。

## 导入方式

<ComponentImport name="AttachmentButton" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 事件     | 类型                        | 说明               |
| -------- | --------------------------- | ------------------ |
| `attach` | `(files: FileList) => void` | 用户选择文件后触发 |

## 注意事项

组件只负责选择文件，不负责上传和文件预览。
