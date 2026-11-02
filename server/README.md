# Go-React-Admin · server

方案 A：Go + Gin + GORM + PostgreSQL。  
分层：[docs/architecture/layering.md](../docs/architecture/layering.md) · 约定：[docs/server/conventions.md](../docs/server/conventions.md)

当前为**可运行示例/占位**，无真实业务逻辑。

## 快速开始

```bash
cd server
go mod tidy
go run ./cmd/api
```

无 DB 可启动（DSN 空）。健康检查：`GET /healthz`。

## 示例 API

| 方法 | 路径 | 鉴权 |
|------|------|------|
| POST | `/api/v1/auth/login` | 否 |
| GET | `/api/v1/platform/tenants` | Bearer |
| GET | `/api/v1/platform/apps` | Bearer |
| GET | `/api/v1/platform/iam/me` | Bearer |
| GET | `/api/v1/platform/audit` | Bearer |
| GET | `/api/v1/apps/demo/items` | Bearer |

兼容前端占位 token：`Authorization: Bearer dev-token`，可选 `X-Tenant-Id`。

## 结构要点

- 模块实现 `module.Module`，由 `bootstrap` 统一挂载
- Handler → Service → Repo；Service 只用 `context.Context` + `shared/ctx`
- JWT：`shared/authjwt`；租户 scope 助手：`shared/db.WithTenant`
