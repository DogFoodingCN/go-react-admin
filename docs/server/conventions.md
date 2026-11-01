# Server 约定

## 目标目录

```text
server/
├── cmd/api/
├── internal/
│   ├── platform/          # tenant, app, iam, auth, audit, setting
│   ├── apps/<app_code>/   # handler, service, repo, dto
│   ├── shared/            # middleware, db, errors, pagination
│   └── bootstrap/
├── migrations/
└── configs/
```

## 分层

- **handler**：解析请求、鉴权上下文、调用 service、写响应
- **service**：业务规则、事务边界、调用其它 platform 能力
- **repo**：持久化；强制 tenant scope
- **dto/types**：API 出入参，与 web 契约对齐

## 命名

- 包名短小、与目录一致
- 权限码：`platform:...` 或 `<app_code>:...`
- 迁移文件：有序版本号 + 简述

## 错误与响应

- 领域错误与 HTTP 映射集中处理，避免 handler 散落魔法数
- 对外错误信息不泄露内部栈；日志含 request_id / tenant_id / user_id

## 禁止

- 在 apps 内复制一套鉴权/租户解析
- 绕过 shared/db scope 直接裸查租户表
- 把密钥写进仓库
