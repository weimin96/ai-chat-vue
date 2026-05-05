# 主题

组件使用 CSS 变量表达颜色和背景。你可以在业务应用入口覆盖这些变量。

```css
:root {
  --ac-primary: #0f766e;
  --ac-bg: #ffffff;
  --ac-surface: #f8fafc;
  --ac-border: #d8dee4;
  --ac-text: #1f2937;
  --ac-muted: #6b7280;
  --ac-user-bg: #0f766e;
  --ac-assistant-bg: #f3f4f6;
  --ac-hover: #eef2f7;
  --ac-input-bg: #ffffff;
}
```

## 常用变量

| 变量                | 说明                             |
| ------------------- | -------------------------------- |
| `--ac-primary`      | 主色，用于按钮、激活态和强调内容 |
| `--ac-bg`           | 容器背景                         |
| `--ac-surface`      | 输入区、侧栏等表面背景           |
| `--ac-border`       | 边框颜色                         |
| `--ac-text`         | 主文本颜色                       |
| `--ac-muted`        | 次级文本颜色                     |
| `--ac-user-bg`      | 用户消息背景                     |
| `--ac-assistant-bg` | 助手消息背景                     |

## 注意事项

组件内部仍使用 Tailwind 工具类控制布局，因此主题主要覆盖色彩和表面层级，不建议依赖 CSS 变量改变结构尺寸。
