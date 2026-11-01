# Server 模块地图

栈：方案 A（Gin + GORM）。脚手架已初始化（示例/占位，2026-11-01）。

## Platform

| 模块 | 路径 | 职责 | 状态 |
|------|------|------|------|
| auth | `internal/platform/auth` | 示例登录发 JWT | example |
| tenant | `internal/platform/tenant` | 示例租户列表 | example |
| app | `internal/platform/app` | 示例应用列表 | example |
| iam | `internal/platform/iam` | 示例 `/me` 权限码 | example |
| audit | `internal/platform/audit` | 空列表占位 | example |
| setting | — | 未建 | planned |

## Apps

| app_code | 路径 | 职责 | 状态 |
|----------|------|------|------|
| demo | `internal/apps/demo` | 示例 items 列表（handler/service/repo 壳） | example |

## Shared / Bootstrap

| 模块 | 路径 | 状态 |
|------|------|------|
| middleware | `internal/shared/middleware` | ready |
| db | `internal/shared/db` | ready（含 `WithTenant`） |
| response / errors / pagination | `internal/shared/*` | ready |
| bootstrap | `internal/bootstrap` | ready |
| config | `internal/config` | ready |
