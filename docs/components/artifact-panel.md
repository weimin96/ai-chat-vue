<script setup>
import Basic from '../examples/artifact-panel/Basic.vue'
import source from '../examples/artifact-panel/Basic.vue?raw'
</script>

# ArtifactPanel

`ArtifactPanel` 展示 HTML、Markdown、JSON 或代码类 Artifact，并提供预览与源码切换。

## 导入方式

<ComponentImport name="ArtifactPanel" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性       | 类型       | 默认值 | 说明          |
| ---------- | ---------- | ------ | ------------- |
| `artifact` | `Artifact` | 必填   | Artifact 对象 |

| 事件     | 说明           |
| -------- | -------------- |
| `update` | 内容更新时触发 |

## 注意事项

HTML 预览使用 iframe sandbox。仍建议只渲染可信内容或经过业务过滤的内容。
