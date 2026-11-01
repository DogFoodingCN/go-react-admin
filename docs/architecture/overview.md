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

## 关键路径（目标结构，随实现落地）

- 后端平台：`server/internal/platform/`
- 后端应用：`server/internal/apps/<app>/`
- 前端：`web/` 下 platform 与 apps 对齐命名

目录未生成前，以本文 + [../ai-workflow/](../ai-workflow/) 为准推进脚手架。
