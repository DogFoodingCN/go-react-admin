# 系统全景

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
│  shared: middleware / db scope / errors     │
└──────────────────┬──────────────────────────┘
                   │
            ┌──────▼──────┐
            │  DB / Cache │
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

- 后端分层：[layering.md](./layering.md)
- 后端平台：`server/internal/platform/<name>/{handler,service,repo}` + `module.go`
- 后端应用：`server/internal/apps/<code>/`（同构）
- 前端：`web/src/{platform,apps}` 与后端对齐命名

流程见 [../ai-workflow/](../ai-workflow/)。
