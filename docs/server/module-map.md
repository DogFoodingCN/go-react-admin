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
| setup | `internal/platform/setup` | `GET/POST /api/v1/setup/*` | ready（status / test-connection / initialize；缺库则 CREATE DATABASE；AutoMigrate） |
| db ensure | `internal/shared/db` | `OpenEnsuring` / `EnsureDatabase` | ready（Setup 测连与初始化用） |
| auth | `internal/platform/auth` | `POST /api/v1/auth/login` | ready（有 platform_users 时 bcrypt；无 DB 仍 stub） |
| tenant | `internal/platform/tenant` | `GET/POST /api/v1/platform/tenants` · `GET/PATCH /:id` | ready（DB 空时 stub） |
| app | `internal/platform/app` | `GET /api/v1/platform/apps` | example |
| iam | `internal/platform/iam` | `GET /api/v1/platform/iam/me` | example |
| audit | `internal/platform/audit` | `GET /api/v1/platform/audit` | example |
| setting | — | — | planned |

## Apps

| app_code | 路径 | HTTP | 状态 |
|----------|------|------|------|
| demo | `internal/apps/demo` | `GET /api/v1/apps/demo/items` | example |
