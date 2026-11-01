# Server 约定

## 已定技术栈（方案 A）

详见 [ADR 0003](../architecture/adr/0003-backend-stack.md) 与 [tech-stack-options.md](./tech-stack-options.md)。  
分层图详见 [architecture/layering.md](../architecture/layering.md)。

| 层 | 选型 | 文档 |
|----|------|------|
| 语言 | Go | [go.dev/doc](https://go.dev/doc/) |
| HTTP | Gin | [gin-gonic.com/docs](https://gin-gonic.com/docs/) |
| ORM | GORM | [gorm.io/zh_CN/docs](https://gorm.io/zh_CN/docs/) |
| 数据库 | PostgreSQL | [postgresql.org/docs](https://www.postgresql.org/docs/) |
| 迁移 | goose | [pressly/goose](https://github.com/pressly/goose) |
| 认证 | JWT（`shared/authjwt`） | [golang-jwt](https://github.com/golang-jwt/jwt) |
| 日志 | log/slog | [pkg.go.dev/log/slog](https://pkg.go.dev/log/slog) |

## 目录结构

```text
server/
├── cmd/api/
├── configs/
├── migrations/
├── internal/
│   ├── bootstrap/              # 装配 Deps + 挂载 Modules
│   ├── module/                 # Module 接口
│   ├── config/
│   ├── shared/
│   │   ├── middleware/         # HTTP 横切
│   │   ├── authjwt/            # JWT 签发解析
│   │   ├── ctx/                # context 中的租户/用户
│   │   ├── db/                 # Open + WithTenant
│   │   ├── response|errors|pagination/
│   ├── platform/<name>/        # auth tenant app iam audit…
│   │   ├── module.go
│   │   ├── handler|service|repo|model|dto/
│   └── apps/<app_code>/        # 同上结构
├── go.mod
└── README.md
```

## 分层职责

| 层 | 职责 | 禁止 |
|----|------|------|
| Handler | 绑参、读中间件上下文、调 Service、写统一响应 | 写业务规则、直接查库 |
| Service | 用例与规则；收 `context.Context` 或显式 tenant/user | 依赖 `*gin.Context` |
| Repo | 持久化；租户表必须 `db.WithTenant` | 暴露 HTTP 概念 |
| Module | `Name` + `RegisterHTTP`；由 bootstrap 收集挂载 | 在 module 外散落注册 |

## 命名与路由

- 权限码：`platform:...` 或 `<app_code>:...`
- 公开：`/api/v1/auth/...`
- 平台：`/api/v1/platform/...`
- 应用：`/api/v1/apps/<code>/...`
- 迁移：`YYYYMMDDHHMMSS_name.sql`

## 错误与响应

统一 JSON：`{ "code", "message", "data" }`。  
日志带 `request_id` / `tenant_id` / `user_id`。

## 禁止

- apps 内自建鉴权/租户解析
- Service/Repo 依赖 Gin
- 绕过 `shared/db` scope 裸查租户表
- `apps/*` 互相 import
- 密钥入库
