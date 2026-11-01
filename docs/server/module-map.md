# Server 模块地图

> 代码目录创建后，将「路径」列改为真实路径。

## Platform

| 模块 | 目标路径 | 职责 | 状态 |
|------|----------|------|------|
| tenant | `internal/platform/tenant` | 租户 CRUD、状态 | planned |
| app | `internal/platform/app` | 应用定义与租户开通 | planned |
| iam | `internal/platform/iam` | 用户/角色/权限/菜单 | planned |
| auth | `internal/platform/auth` | 登录与令牌 | planned |
| audit | `internal/platform/audit` | 审计 | planned |
| setting | `internal/platform/setting` | 配置 | planned |

## Apps

| app_code | 目标路径 | 职责 | 状态 |
|----------|----------|------|------|
| — | — | 尚无业务应用；建议首个 `demo` | — |

## Shared

| 模块 | 目标路径 | 职责 | 状态 |
|------|----------|------|------|
| middleware | `internal/shared/middleware` | 鉴权、租户、日志 | planned |
| db | `internal/shared/db` | 连接与 tenant scope | planned |
