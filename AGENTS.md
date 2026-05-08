# Repository Guidelines

## 项目结构与模块组织

本仓库是 Vue 3 + TypeScript 组件库。`src/` 存放库源码，`src/index.ts` 负责公开导出；`src/components/` 按组件域组织，`src/composables/` 存放组合式逻辑，`src/headless/` 存放无样式能力，`src/adapters/` 存放外部服务适配。`docs/` 是 VitePress 文档，`docs/examples/` 保存组件示例。`play/` 是本地 playground，用于组合验证和交互调试。`dist/` 为构建产物，除发布验证外不要手工修改。

## 构建、测试与开发命令

- `npm install`：按 `package-lock.json` 安装依赖。
- `npm run dev`：启动 `play/` playground。
- `npm run docs:dev`：启动文档站点。
- `npm run lint`：执行 ESLint 检查。
- `npm run typecheck`：执行 `vue-tsc` 类型检查。
- `npm run test`：使用 Vitest 与 jsdom 运行测试。
- `npm run build`：构建组件库并生成类型声明。
- `npm run docs:build`：验证文档可构建。

## 编码风格与命名约定

统一使用 UTF-8、LF、两个空格缩进和单引号；Prettier 配置为不使用分号，尾随逗号采用 `es5`。Vue 单文件组件使用 PascalCase，例如 `MessageAvatar.vue`；组合式函数使用 `useXxx`，例如 `useConversation`。公开 API 必须从 `src/index.ts` 导出。ESLint 禁止 `any`，未使用参数使用 `_` 前缀；导入和导出顺序由 `simple-import-sort` 检查。

## 测试指南

测试文件与实现靠近放置，命名为 `*.test.ts`，示例见 `src/components/Markdown/markdown.test.ts`。新增渲染、Markdown、安全净化、流式状态或公开 API 行为时，应补充对应单元测试。定向验证可运行：

```powershell
npx vitest run src/components/Markdown/markdown.test.ts --environment jsdom
```

## 提交与 Pull Request 规范

提交信息以 `CONTRIBUTING.md` 的 Conventional Commits 为准，历史提交也使用中文摘要。推荐格式：`feat: 优化消息操作`、`docs: 补充组件示例`、`fix: 修复流式状态更新`。PR 需说明改动动机、影响范围和验证方式；涉及 UI 变更时提供截图；涉及公开 API、样式入口或安全逻辑时说明兼容性和失败路径。

## 安全与配置

不要提交密钥、令牌或本地环境配置。Markdown、HTML 渲染和外部链接处理必须保留显式净化逻辑；修改相关代码时同时验证默认转义、受控 HTML 和危险协议过滤。
