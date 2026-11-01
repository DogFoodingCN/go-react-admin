# go-react-admin

General Multi-Tenant Multi-App Backend（Go + React）。

## 文档入口

完整文档在 **[docs/](./docs/README.md)**。

AI 全栈开发请从 **[docs/ai-workflow/](./docs/ai-workflow/README.md)** 开始：

```text
Intake → Plan → Implement → Verify → Document → Handoff
```

常用提示词：[docs/ai-workflow/prompts/](./docs/ai-workflow/prompts/)。

## 仓库结构

| 目录 | 说明 |
|------|------|
| `server/` | Go API |
| `web/` | React 管理端 |
| `deploy/` | 部署与编排 |
| `docs/` | 架构、约定与 AI 工作流 |

## 快速开始

### Web（方案 A 已初始化）

```bash
cd web
pnpm install
pnpm approve-builds esbuild   # 首次若提示 ignored builds
pnpm dev                      # http://localhost:5173
```

任意账号可本地占位登录。说明见 [`web/README.md`](./web/README.md) 与 [`docs/web/`](./docs/web/)。

### Server

`server/` 脚手架待建；架构约定见 [`docs/server/`](./docs/server/) 与 [`docs/architecture/`](./docs/architecture/)。
