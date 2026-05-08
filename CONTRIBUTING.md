# 贡献指南

## 开发环境

- 使用 Node.js 与 npm 安装依赖。

## 常用命令

```powershell
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

## 本地预览

```powershell
npm run dev
```

该命令启动 `play/` 目录中的本地 playground，用于验证组件组合、主题和流式交互。

## 文档预览

```powershell
npm run docs:dev
```

文档源码位于 `docs/`，组件示例位于 `docs/examples/`。

## 提交规范

提交信息使用 Conventional Commits：

| 类型 | 适用范围 |
|------|----------|
| `feat` | 新增能力或公开 API |
| `fix` | 缺陷修复 |
| `docs` | 文档修改 |
| `refactor` | 不改变行为的结构调整 |
| `test` | 测试新增或调整 |
| `chore` | 构建、依赖、脚本等维护工作 |

## Pull Request 要求

- 说明改动动机、影响范围和验证方式。
- 公共 API 变更必须说明兼容性影响。
- 安全相关改动需要列出失败路径和边界条件。
