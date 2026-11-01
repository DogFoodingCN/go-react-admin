# ADR 0002 · 前端技术栈采用方案 A

- Status: Accepted
- Date: 2026-11-01
- Relates: [../web/tech-stack-options.md](../../web/tech-stack-options.md)

## Context

需为多租户、多应用管理后台选定前端栈。候选见 tech-stack-options（A Ant Design / B shadcn / C Refine / D Umi）。优先后台交付效率、动态菜单与权限、与 Go API 的 SPA 协作。

## Decision

采用 **方案 A**：

| 层 | 选型 | 文档 |
|----|------|------|
| 构建 | Vite | [vitejs.dev](https://vitejs.dev/) · [中文](https://cn.vitejs.dev/) |
| 语言 | TypeScript | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) |
| UI | React + Ant Design 5 + `@ant-design/pro-components` | [React](https://react.dev/) · [antd](https://ant.design/components/overview-cn) · [ProComponents](https://procomponents.ant.design/) |
| 路由 | React Router 6/7 | [reactrouter.com](https://reactrouter.com/) |
| 服务端状态 | TanStack Query | [tanstack.com/query](https://tanstack.com/query/latest) |
| 客户端状态 | Zustand | [zustand.docs.pmnd.rs](https://zustand.docs.pmnd.rs/) |
| 请求 | 统一 HTTP client（注入 token + tenant） | [fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) · [axios](https://axios-http.com/docs/intro) |
| 包管理 | pnpm | [pnpm.io/zh](https://pnpm.io/zh/) |
| 目录起步 | 单仓 `web/src/{app,platform,apps,shared}`；多应用增长后再拆 workspace | [web/conventions.md](../../web/conventions.md) |

更完整的链接表（含 Zod、Charts 等可选）见 [tech-stack-options.md · 方案 A](../../web/tech-stack-options.md#方案-a--react--vite--typescript--ant-design-5--procomponents)。

## Consequences

- 表格/表单/布局可快速落地；国内与 AI 资料充足
- 需对 ProLayout / 菜单做适配层，以后端下发结构为准，避免业务页耦合 Pro 私有数据
- 视觉相对同质；若未来强品牌化控制台，可局部引入定制主题或评估迁移成本
- 不采用 Umi 全约定，保持 Vite 项目可控性
