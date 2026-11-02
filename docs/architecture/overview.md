# 系统全景

多租户 × 多应用的管理与实现（含总体 Mermaid）：**[tenancy-multi-app.md](./tenancy-multi-app.md)**。

## 逻辑视图

```text
┌─────────────────────────────────────────────┐
│                  web (React)                │
│  console: platform UI + apps/* UI shells    │
└──────────────────┬──────────────────────────┘
                   │ HTTP/JSON (auth + tenant)
┌──────────────────▼──────────────────────────┐
│                 server (Go)                 │
│  platform: tenant / app / iam / auth / audit│
│  apps/*: 业务应用模块                        │
│  shared: middleware / db scope / ctx        │
└──────────────────┬──────────────────────────┘
                   │
            ┌──────▼──────┐
            │  DB / Cache │  共享库 + tenant_id
            └─────────────┘
```

## 边界

| 层 | 负责 | 不负责 |
|----|------|--------|
| platform | 租户、应用生命周期、身份权限、审计 | 具体业务单据 |
| apps/* | 领域功能 | 自己实现登录/租户解析 |
| web platform | 租户切换、应用开通、用户角色 | 业务复杂表单（属 apps） |
| web apps | 应用内页面 | 绕过权限/租户上下文 |

## 关键路径

- 多租户/多应用总览：[tenancy-multi-app.md](./tenancy-multi-app.md)
- 后端分层：[layering.md](./layering.md)
- 后端：`server/internal/platform|apps` + `module.go`
- 前端：`web/src/{platform,apps}`

流程见 [../ai-workflow/](../ai-workflow/)。
