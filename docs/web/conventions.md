# Web 约定

## 已定技术栈（方案 A）

详见 [ADR 0002](../architecture/adr/0002-frontend-stack.md) 与 [tech-stack-options.md](./tech-stack-options.md)。

| 层 | 选型 | 文档 |
|----|------|------|
| 构建 | Vite | [英文](https://vitejs.dev/) · [中文](https://cn.vitejs.dev/) |
| 语言 | TypeScript + React | [TS](https://www.typescriptlang.org/docs/) · [React](https://react.dev/) |
| UI | Ant Design 5 + ProComponents | [antd](https://ant.design/components/overview-cn) · [ProComponents](https://procomponents.ant.design/) |
| 路由 | React Router | [reactrouter.com](https://reactrouter.com/) |
| 服务端状态 | TanStack Query | [tanstack.com/query](https://tanstack.com/query/latest) |
| 客户端状态 | Zustand（用户、当前租户、布局等） | [zustand.docs.pmnd.rs](https://zustand.docs.pmnd.rs/) |
| 请求 | 统一 client，注入 auth token + tenant | [fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) · [axios](https://axios-http.com/docs/intro) |
| 包管理 | pnpm | [pnpm.io](https://pnpm.io/zh/) |

完整对比与可选依赖（Zod / Charts 等）见 [tech-stack-options.md · 方案 A](./tech-stack-options.md#方案-a--react--vite--typescript--ant-design-5--procomponents)。

## 目录结构（起步：简单模式）

```text
web/
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── app/              # 路由、布局壳、providers
    │   ├── providers.tsx # QueryClient、ConfigProvider、Auth、Tenant
    │   ├── router.tsx
    │   └── layouts/      # 基于 ProLayout 的适配层（菜单来自后端）
    ├── platform/         # 租户、应用、IAM、审计等平台页
    ├── apps/             # 业务应用，按 <app_code> 隔离
    │   └── <code>/
    └── shared/           # api、auth、tenant、权限、ui 封装、hooks
        ├── api/
        ├── auth/
        ├── tenant/
        ├── access/
        └── ui/
```

多应用规模上来后，可再拆 `web/apps/console` + `web/packages/*`（workspace），不改变 platform/apps/shared 边界。

## 原则

1. **租户上下文唯一来源**：`TenantProvider` / Zustand tenant slice，页面禁止写死 tenantId。
2. **权限码与后端一致**：无权限隐藏或禁用操作；路由级守卫不可省。
3. **应用隔离**：`apps/<code>` 不依赖另一业务应用内部文件；共享进 `shared`。
4. **菜单数据**：后端按租户开通下发；ProLayout 只做渲染适配，业务页不依赖 Pro 菜单内部结构。
5. **Pro 组件克制**：优先 ProTable/ProForm；复杂多应用壳逻辑放在 `app/layouts` 适配层。

## 命名与路由

- 平台：`/platform/...`（如 `/platform/tenants`）
- 应用：`/apps/<code>/...`
- 权限码：与后端一致，`platform:...` 或 `<app_code>:...`
- 组件文件：PascalCase；目录与路由模块用 kebab-case / 与 app_code 一致

## 文件示例（约定）

```text
src/platform/tenant/pages/TenantListPage.tsx
src/apps/demo/pages/DemoListPage.tsx
src/shared/api/client.ts
src/shared/access/usePermission.ts
```
