# 05 · Document（文档回写）

## 目标

把「实现后的真相」写回 `docs/` **正确层级**；保证下一会话 AI 可读。

## 回写路由

| 变更类型 | 更新位置 |
|----------|----------|
| 工作流/提示词 | `docs/ai-workflow/` |
| 租户/应用/权限模型 | `docs/architecture/` + 必要时 ADR |
| 后端模块新增/搬家 | `docs/server/module-map.md`、conventions |
| 前端模块/路由约定 | `docs/web/module-map.md`、conventions |
| 环境变量/发布 | `docs/deploy/` |
| 文档规则本身 | `docs/contributing/` |

细则见 [../contributing/doc-maintenance.md](../contributing/doc-maintenance.md)。

## AI 回写步骤

1. 列出本次行为变更点（不是文件 diff 流水账）。
2. 按上表定位文件；没有则新建并挂到该目录 `README.md`。
3. 更新交叉链接（文档地图、module-map）。
4. 若为架构决策，新增 ADR，旧 ADR 标记 superseded。

## 禁止

- 只在聊天里总结、不改 `docs/`
- 把实现细节长篇贴进 architecture（应链到 server/web）
- 复制粘贴过期计划当现行设计

## 出口条件

- [ ] 对应层级文档已更新或已声明「无文档影响」
- [ ] 索引/README 链接有效
- [ ] 进入 [06-handoff.md](./06-handoff.md)
