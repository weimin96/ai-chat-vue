<script setup>
import Basic from '../examples/artifact-panel/Basic.vue'
import source from '../examples/artifact-panel/Basic.vue?raw'
</script>

# ArtifactPanel

`ArtifactPanel` 展示 HTML、Markdown、JSON 或代码类 Artifact，并提供预览与源码切换。HTML Artifact 默认只展示源码。

## 导入方式

<ComponentImport name="ArtifactPanel" />

## 基础用法

<ExampleBlock :source="source">
  <Basic />
</ExampleBlock>

## API

| 属性 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `artifact` | `Artifact` | 必填 | Artifact 对象 |
| `enableUnsafeHtmlPreview` | `boolean` | `false` | 是否允许 HTML Artifact 生成 iframe 预览 |

| 事件 | 说明 |
| ---- | ---- |
| `update` | 内容更新时触发 |
| `fullscreen-change` | 全屏状态变化时返回 `boolean` |
| `tab-change` | 预览和源码页签切换时返回 `'preview' \| 'source'` |
| `copy` | 点击复制按钮时返回当前内容 |

## 注意事项

HTML 预览需要显式传入 `enableUnsafeHtmlPreview`。开启后组件会创建 Blob URL，并使用 `sandbox="allow-scripts"` 和 `referrerpolicy="no-referrer"`；内容更新或组件卸载时会回收 URL。模型输出或用户输入生成的 HTML 不建议开启执行预览。
