# Web 模块地图

栈：方案 A（Vite + React + antd）。脚手架已初始化（2026-11-01）。

## App shell

| 模块 | 路径 | 状态 |
|------|------|------|
| 入口 / Providers | `src/main.tsx`, `src/app/providers.tsx` | ready |
| 路由 | `src/app/router.tsx` | ready（Setup 闸门） |
| 布局（ProLayout 适配） | `src/app/layouts/BasicLayout.tsx` | ready |
| 静态菜单（待换后端） | `src/app/layouts/menu-config.tsx` | ready |

## Platform UI

| 模块 | 路径 | 状态 |
|------|------|------|
| 初始化向导 | `src/platform/setup/` | ready（入口 + DSN/超管 Steps · 对齐 Figma） |
| 登录 | `src/platform/auth/pages/LoginPage.tsx` | ready（左右分栏 · auth API；DEV 假登录需显式开关） |
| 工作台 | `src/platform/dashboard/pages/DashboardPage.tsx` | ready（Figma 结构） |
| 租户管理 | `src/platform/tenant/` | ready（列表/创建/编辑接 API） |
| 品牌壳 | `src/shared/ui/AuthBrandLayout.tsx` | ready（登录/Setup 共用） |
| 应用开通 | `src/platform/app/pages/` | ready（开通/停用） |
| 用户角色 | `src/platform/iam/pages/` | ready（Tabs 用户/角色） |
| 审计 | `src/platform/audit/pages/` | ready（筛选 + 表） |

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
| ui 封装 | `src/shared/ui/` | ready（PageContainer / EmptyState / ForbiddenResult） |
| setup 闸门 | `src/shared/setup/` | ready |
