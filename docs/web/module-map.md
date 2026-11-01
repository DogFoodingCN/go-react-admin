# Web 模块地图

栈：方案 A（Vite + React + antd）。脚手架落地后把「状态」改为 `ready` 并核对路径。

## App shell

| 模块 | 目标路径 | 状态 |
|------|----------|------|
| 入口 / Providers | `src/main.tsx`, `src/app/providers.tsx` | planned |
| 路由 | `src/app/router.tsx` | planned |
| 布局（ProLayout 适配） | `src/app/layouts/` | planned |

## Platform UI

| 模块 | 目标路径 | 状态 |
|------|----------|------|
| 登录 | `src/platform/auth` | planned |
| 租户管理 | `src/platform/tenant` | planned |
| 应用开通 | `src/platform/app` | planned |
| 用户角色 | `src/platform/iam` | planned |
| 审计 | `src/platform/audit` | planned |

## App UI

| app_code | 目标路径 | 状态 |
|----------|----------|------|
| — | — | 尚无；建议首个 `demo` |

## Shared

| 模块 | 目标路径 | 状态 |
|------|----------|------|
| api client | `src/shared/api` | planned |
| auth | `src/shared/auth` | planned |
| tenant | `src/shared/tenant` | planned |
| access（权限） | `src/shared/access` | planned |
| ui 封装 | `src/shared/ui` | planned |
