# 架构文档

跨 `server/` 与 `web/` 的设计真相源。实现细节分别见 `docs/server`、`docs/web`。

| 文档 | 内容 |
|------|------|
| [overview.md](./overview.md) | 系统全景、模块边界 |
| [tenancy-multi-app.md](./tenancy-multi-app.md) | **多租户×多应用总览（管理+实现+Mermaid）** |
| [setup-before-login.md](./setup-before-login.md) | **登录前 DB/平台初始化（Intake+方案+Plan）** |
| [tenancy.md](./tenancy.md) | 多租户隔离速查 |
| [multi-app.md](./multi-app.md) | 多应用约定与清单速查 |
| [layering.md](./layering.md) | 后端分层与依赖规则 |
| [adr/](./adr/) | 架构决策记录 |

## AI 指引

- 涉及租户/应用开通/菜单权限：先读 [tenancy-multi-app.md](./tenancy-multi-app.md)。
- 改平台能力或跨模块契约：先读本目录，必要时补 ADR。
- 不要在此粘贴大段代码；链接到模块即可。
