# Playground

本项目使用 `play/` 作为本地组件开发入口。它与文档站职责不同：

- `play/`：面向开发者，用于组合验证、交互调试和响应式巡检。
- `docs/`：面向使用者，用于阅读说明、查看 API 和运行稳定示例。

`play/` 不要求为每个组件都建立独立示例。公开组件的基础用法放在 `docs/examples/`，`play/` 只保留能帮助开发调试的场景，例如完整聊天、消息状态、输入区状态和独立渲染切片。

启动本地调试：

```powershell
npm run dev
```

构建本地调试入口：

```powershell
npm run play:build
```
