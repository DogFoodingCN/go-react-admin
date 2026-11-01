# Server 实现检查清单

每个触及后端的切片结束前勾选：

## 结构

- [ ] 代码落在 `platform/<name>` 或 `apps/<code>`，含 handler / service / repo（按需 model/dto）
- [ ] 通过 `module.Module` 注册；未在业务包外手写零散路由（除 healthz）
- [ ] Service **不** import Gin；租户/用户来自 `shared/ctx` 或显式参数

## 租户与安全

- [ ] 租户表读写经 `db.WithTenant`
- [ ] 鉴权走 middleware；JWT 走 `shared/authjwt`
- [ ] 权限码校验在 service 或统一中间件（有业务时）
- [ ] 敏感操作写审计（有业务时）

## 质量

- [ ] 统一 `shared/response` 错误语义
- [ ] 新表有 goose 迁移
- [ ] `go build ./...` 通过
