# go-react-admin 文档中心

通用多租户、多应用后台（Go + React）。本文档体系同时服务**人类开发者**与 **AI 全栈代理**。

## 文档地图

| 目录 | 用途 | AI 何时必读 |
|------|------|-------------|
| [ai-workflow/](./ai-workflow/) | AI 全栈工作流（需求→规划→实现→验证→回写） | **每次任务开始** |
| [architecture/](./architecture/) | 租户模型、多应用、ADR | 改平台能力或跨模块设计时 |
| [server/](./server/) | Go 后端约定与模块地图 | 改 `server/` 时 |
| [web/](./web/) | React 前端约定与模块地图 | 改 `web/` 时 |
| [deploy/](./deploy/) | 部署与环境 | 改配置、镜像、发布时 |
| [contributing/](./contributing/) | 协作与文档维护规则 | 写文档、提交流程时 |

## AI 快速入口

1. 读 [ai-workflow/README.md](./ai-workflow/README.md) 确认阶段与角色。
2. 按任务类型打开对应阶段文档与 [prompts/](./ai-workflow/prompts/)。
3. 触及租户/应用边界时读 [architecture/](./architecture/)。
4. 实现前后分别核对 [server/checklist.md](./server/checklist.md) / [web/checklist.md](./web/checklist.md)。
5. 任务结束按 [ai-workflow/05-document.md](./ai-workflow/05-document.md) **回写本目录**，禁止只改代码不改文档。

## 仓库顶层对应关系

```text
docs/ai-workflow  →  流程与提示词（不放业务实现）
docs/architecture →  跨端设计真相源
docs/server       →  server/ 代码约定
docs/web          →  web/ 代码约定
docs/deploy       →  deploy/ 与运行环境
```

## 维护原则

- **分级存放**：流程进 `ai-workflow`，设计进 `architecture`，实现约定进 `server`/`web`，禁止全部堆在根 README。
- **单一真相源**：同一事实只在一处详写，其它处链接。
- **可执行**：文档写清输入、输出、完成标准；避免空泛口号。
- **随代码演进**：行为变更必须同步对应 docs；见 [contributing/doc-maintenance.md](./contributing/doc-maintenance.md)。
