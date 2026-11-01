# Web 模块地图

栈：方案 A（Vite + React + antd）。脚手架已初始化（2026-11-01）。

## App shell

| 模块 | 路径 | 状态 |
|------|------|------|
| 入口 / Providers | `src/main.tsx`, `src/app/providers.tsx` | ready |
| 路由 | `src/app/router.tsx` | ready |
| 布局（ProLayout 适配） | `src/app/layouts/BasicLayout.tsx` | ready |
| 静态菜单（待换后端） | `src/app/layouts/menu-config.tsx` | ready |

## Platform UI

| 模块 | 路径 | 状态 |
|------|------|------|
| 登录 | `src/platform/auth/pages/LoginPage.tsx` | ready（本地占位登录） |
| 工作台 | `src/platform/dashboard/pages/DashboardPage.tsx` | ready |
| 租户管理 | `src/platform/tenant/pages/TenantListPage.tsx` | ready（占位数据） |
| 应用开通 | `src/platform/app/pages/AppListPage.tsx` | ready（占位数据） |
| 用户角色 | `src/platform/iam/pages/IamPage.tsx` | ready（占位） |
| 审计 | `src/platform/audit/pages/AuditPage.tsx` | ready（占位） |

## App UI

| app_code | 路径 | 状态 |
|----------|------|------|
| demo | `src/apps/demo/pages/DemoListPage.tsx` | ready（占位列表） |

## Shared

| 模块 | 路径 | 状态 |
|------|------|------|
| api client | `src/shared/api/client.ts` | ready |
| auth store / 守卫 | `src/shared/auth/` | ready |
| tenant store | `src/shared/tenant/tenant-store.ts` | ready |
| access（权限） | `src/shared/access/usePermission.ts` | ready（占位） |
| ui 封装 | `src/shared/ui/PageContainer.tsx` | ready |
