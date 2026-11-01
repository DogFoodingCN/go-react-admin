# Server 约定

## 已定技术栈（方案 A）

详见 [ADR 0003](../architecture/adr/0003-backend-stack.md) 与 [tech-stack-options.md](./tech-stack-options.md)。

| 层 | 选型 | 文档 |
|----|------|------|
| 语言 | Go | [go.dev/doc](https://go.dev/doc/) |
| HTTP | Gin | [gin-gonic.com/docs](https://gin-gonic.com/docs/) |
| ORM | GORM | [gorm.io/zh_CN/docs](https://gorm.io/zh_CN/docs/) |
| 数据库 | PostgreSQL | [postgresql.org/docs](https://www.postgresql.org/docs/) |
| 迁移 | goose | [pressly/goose](https://github.com/pressly/goose) |
| 认证 | JWT | [golang-jwt](https://github.com/golang-jwt/jwt) |
| 日志 | log/slog | [pkg.go.dev/log/slog](https://pkg.go.dev/log/slog) |

## 目录结构

```text
server/
├── cmd/api/                 # 进程入口
├── configs/                 # 示例配置（无密钥）
├── migrations/              # goose SQL
├── internal/
│   ├── bootstrap/           # 装配路由与依赖
│   ├── platform/            # tenant, app, iam, auth, audit…
│   ├── apps/<app_code>/     # handler / service / repo / dto
│   └── shared/              # middleware, db, response, errors
├── go.mod
└── README.md
```

## 分层

- **handler**：解析请求、读上下文、调 service、写响应
- **service**：业务规则（需求到来后再填；脚手架可返回示例数据）
- **repo**：持久化；经 `shared/db` 租户 scope
- **dto**：API 出入参

## 命名

- 权限码：`platform:...` 或 `<app_code>:...`
- 路由：`/api/v1/platform/...`、`/api/v1/apps/<code>/...`
- 迁移：`YYYYMMDDHHMMSS_name.sql`

## 错误与响应

统一 JSON：`{ "code", "message", "data" }`（见 `shared/response`）。  
日志带 `request_id` / `tenant_id` / `user_id`。

## 禁止

- apps 内自建鉴权/租户解析
- 绕过 `shared/db` scope 裸查租户表
- 密钥入库
