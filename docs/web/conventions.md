# Web 约定

## 目标结构（二选一，脚手架时定案并回写本文）

**简单模式（起步推荐）**

```text
web/src/
├── app/           # 路由、布局、providers
├── platform/      # 租户、应用、IAM、审计页面
├── apps/<code>/   # 业务应用页面
└── shared/        # ui、api、hooks、auth、tenant
```

**Workspace 模式（规模上来后）**

```text
web/apps/console
web/packages/{ui,api-client,auth,tenant,app-kit}
```

## 原则

1. **租户上下文唯一来源**：`TenantProvider`（名称可定），页面禁止写死 tenantId。
2. **权限码与后端一致**：无权限隐藏或禁用操作；不能只藏按钮不拦路由。
3. **应用隔离**：`apps/<code>` 不依赖另一业务应用的内部文件；共享进 `shared` 或 packages。
4. **菜单数据**：优先后端下发（按租户开通过滤），前端只做渲染。

## 命名

- 路由 path 建议：`/apps/<code>/...` 与平台 `/platform/...`
- 组件文件与导出风格跟随选定脚手架（Vite + React）默认，确定后在此补充一例
