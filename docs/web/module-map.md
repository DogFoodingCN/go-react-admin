# Web 模块地图

栈：方案 A（Vite + React + antd）。脚手架已初始化（2026-11-01）。

## App shell

| 模块 | 路径 | 状态 |
|------|------|------|
| 入口 / Providers | `src/main.tsx`, `src/app/providers.tsx` | ready |
| 路由 | `src/app/router.tsx` | ready（Setup 闸门） |
| 布局（ProLayout 适配） | `src/app/layouts/BasicLayout.tsx` | ready |
| 静态菜单（待换后端） | `src/app/layouts/menu-config.tsx` | ready |

### App shell / Figma 04 Patterns 对齐

- Figma 源页：`04 Patterns`；覆盖展开态、折叠态、用户菜单与通知空状态。
- 默认侧栏基于 `05 Features / B/platform/dashboard/default` 源节点
  `107:6098` 加宽为 `15rem`（240px），折叠侧栏为 `4.5rem`（72px），
  顶栏为 `3.5rem`（56px）；菜单统一 49px 高、6px 间距，侧栏使用
  `#071d57`，选中菜单使用蓝色渐变。
- `04 Patterns / B/Shell/Default` 中的侧栏为源节点直接克隆
  （`260:530`），品牌、菜单坐标、装饰图形与页脚均以该节点为准。
- ProLayout 的 `layout="side"` 不渲染可用顶栏，因此顶栏由
  `BasicLayout.tsx` 在内容区显式实现；菜单路由和侧栏能力仍由 ProLayout
  承担。
- Shell 自定义尺寸使用 rem；Ant Design 组件 API 中的数值尺寸继续使用其
  约定的 number，避免破坏组件内部计算。
- 通知入口当前只提供视觉与空状态；用户菜单保留“个人设置”占位提示和原有
  退出登录逻辑。

## Platform UI

| 模块 | 路径 | 状态 |
|------|------|------|
| 初始化向导 | `src/platform/setup/` | ready（入口 + DSN/超管 Steps · 对齐 Figma）；UI 要点见 [setup-entry-ui-notes.md](./setup-entry-ui-notes.md) |
| 登录 | `src/platform/auth/pages/LoginPage.tsx` | ready（`AuthEntryShell` + 登录卡片；DEV 假登录需显式开关） |
| 工作台 | `src/platform/dashboard/pages/DashboardPage.tsx` | ready（完整对齐 Figma `B/platform/dashboard/default`：欢迎区、KPI、数据概览、租户分布、动态、快捷入口） |
| 租户管理 | `src/platform/tenant/` | ready（列表/创建/编辑接 API） |
| 品牌壳 | `src/shared/ui/AuthBrandLayout.tsx` | ready（`AuthEntryShell` 登录/Setup 入口共用；`SetupWizardShell` 向导） |
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
| ui 封装 | `src/shared/ui/` | ready（PageContainer / EmptyState / ForbiddenResult / AuthBrandLayout） |
| rem 工具 | `src/shared/style/rem.ts` | ready |
| setup 闸门 | `src/shared/setup/` | ready |
