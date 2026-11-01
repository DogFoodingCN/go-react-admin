# go-react-admin · server

方案 A：Go + Gin + GORM + PostgreSQL。业务逻辑按后续需求填充；当前为**可运行示例/占位**。

约定：[docs/server/conventions.md](../docs/server/conventions.md) · [ADR 0003](../docs/architecture/adr/0003-backend-stack.md)

## 快速开始

```bash
cd server
go mod tidy
go run ./cmd/api
# 可选：go run ./cmd/api configs/config.example.yaml
```

默认无 DB 也可启动（`database.dsn` 留空或 `GRA_DB_DSN=`）。健康检查：`GET /healthz`。

## 示例 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/auth/login` | 示例登录，返回 JWT |
| GET | `/api/v1/platform/tenants` | 示例租户列表（需 Bearer） |
| GET | `/api/v1/platform/apps` | 示例应用列表 |
| GET | `/api/v1/platform/iam/me` | 示例权限码 |
| GET | `/api/v1/platform/audit` | 空审计列表占位 |
| GET | `/api/v1/apps/demo/items` | Demo 应用示例列表 |

前端占位 token `dev-token` 亦可通过鉴权。请求可带 `X-Tenant-Id`。

```bash
curl -s localhost:8080/api/v1/auth/login -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin"}'

curl -s localhost:8080/api/v1/apps/demo/items \
  -H "Authorization: Bearer <token>" \
  -H "X-Tenant-Id: tenant-demo"
```

## 目录

```text
cmd/api/
internal/bootstrap/
internal/platform/{auth,tenant,app,iam,audit}
internal/apps/demo/{handler,service,repo,dto}
internal/shared/{middleware,db,response,errors,pagination}
migrations/          # goose 示例 SQL
configs/
```

迁移（有 Postgres 后）：使用 [goose](https://github.com/pressly/goose) 执行 `migrations/`。
