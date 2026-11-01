# 架构文档

跨 `server/` 与 `web/` 的设计真相源。实现细节分别见 `docs/server`、`docs/web`。

| 文档 | 内容 |
|------|------|
| [overview.md](./overview.md) | 系统全景、模块边界 |
| [layering.md](./layering.md) | 后端分层与依赖规则 |
| [tenancy.md](./tenancy.md) | 多租户模型与隔离 |
| [multi-app.md](./multi-app.md) | 多应用注册与挂载 |
| [adr/](./adr/) | 架构决策记录 |

## AI 指引

- 改平台能力或跨模块契约：先读本目录，必要时补 ADR。
- 不要在此粘贴大段代码；链接到模块即可。
