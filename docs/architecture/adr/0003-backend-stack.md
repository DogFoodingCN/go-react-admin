# ADR 0003 · 后端技术栈采用方案 A

- Status: Accepted
- Date: 2026-11-01
- Relates: [../server/tech-stack-options.md](../../server/tech-stack-options.md)

## Context

需为多租户多应用管理后台选定 Go API 栈。候选见 tech-stack-options（A Gin+GORM / B sqlc / C ent / D stdlib / E go-zero）。当前形态为模块化单体，前端已定方案 A（Vite + React + antd）。

## Decision

采用 **方案 A**：

| 层 | 选型 |
|----|------|
| 语言 | Go 1.22+ |
| HTTP | Gin |
| ORM | GORM |
| 数据库 | PostgreSQL |
| 迁移 | goose（SQL 文件） |
| 认证 | JWT（占位实现可后续替换） |
| 日志 | `log/slog` |
| 配置 | 环境变量 + `configs/*.example.yaml` |
| 缓存 | 可选 Redis（脚手架暂不强制） |

目录保持 `cmd/api`、`internal/{platform,apps,shared,bootstrap}`。业务逻辑按需求迭代；脚手架仅提供示例/占位。

**不采用 go-zero**：现阶段无微服务治理刚需，避免生成目录与框架锁定；拆服务时再评估。

## Consequences

- 交付快，与国内/AI 资料匹配
- 必须在 `shared/db` 强制租户 scope，防止 GORM 漏 `tenant_id`
- 复杂 SQL 后续可在个别 repo 手写或局部引入 sqlc，不必整体换栈
