# Server 模块地图

栈：方案 A。分层重构后均为 **example/stub**（无真实业务）。

## 装配

| 模块 | 路径 | 状态 |
|------|------|------|
| module 接口 | `internal/module` | ready |
| bootstrap | `internal/bootstrap` | ready |
| config | `internal/config` | ready |

## Shared

| 模块 | 路径 | 状态 |
|------|------|------|
| middleware | `internal/shared/middleware` | ready |
| authjwt | `internal/shared/authjwt` | ready |
| ctx | `internal/shared/ctx` | ready |
| db | `internal/shared/db` | ready |
| response / errors / pagination | `internal/shared/*` | ready |

## Platform（均含 module + handler/service/repo）

| 模块 | 路径前缀 | HTTP | 状态 |
|------|----------|------|------|
| auth | `internal/platform/auth` | `POST /api/v1/auth/login` | example |
| tenant | `internal/platform/tenant` | `GET /api/v1/platform/tenants` | example |
| app | `internal/platform/app` | `GET /api/v1/platform/apps` | example |
| iam | `internal/platform/iam` | `GET /api/v1/platform/iam/me` | example |
| audit | `internal/platform/audit` | `GET /api/v1/platform/audit` | example |
| setting | — | — | planned |

## Apps

| app_code | 路径 | HTTP | 状态 |
|----------|------|------|------|
| demo | `internal/apps/demo` | `GET /api/v1/apps/demo/items` | example |
