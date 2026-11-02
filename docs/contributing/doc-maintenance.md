# 文档维护约定

## 各级目录写什么

| 路径 | 写入内容 | 不要写入 |
|------|----------|----------|
| `docs/ai-workflow/` | 阶段流程、角色、DoD、提示词模板 | 具体业务字段、某次任务流水账 |
| `docs/design/` | Figma 出图、B/C 端设计 SOP、设计交付规范 | 业务代码实现细节 |
| `docs/architecture/` | 租户/应用模型、跨端契约、ADR | 某文件行级实现细节 |
| `docs/server/` | Go 目录约定、模块地图、后端检查清单 | 前端路由、UI 文案 |
| `docs/web/` | React 约定、前端模块地图、检查清单 | DB schema、迁移细节 |
| `docs/deploy/` | 环境、镜像、发布步骤 | 应用业务逻辑 |
| `docs/contributing/` | 协作与文档规则 | 架构决策正文 |

## AI 任务结束回写清单

按变更类型勾选（至少一项）：

- [ ] 新增/变更平台能力 → 更新 `architecture/` 与对应 ADR
- [ ] 新增业务应用 → `architecture/multi-app.md` + `server/module-map.md` + `web/module-map.md`
- [ ] 变更 API / 权限码 → `server/` 与 `web/` 相关约定
- [ ] 变更部署/配置 → `deploy/`
- [ ] 变更工作流本身 → `ai-workflow/`
- [ ] 无文档影响 → 在交付说明中显式写「无 docs 变更及原因」

## 命名与格式

- 文件名：小写 kebab-case，`README.md` 作为目录入口。
- 阶段文档可用数字前缀保证阅读顺序：`00-` … `06-`。
- 交叉引用用相对 Markdown 链接。
- ADR：`architecture/adr/NNNN-short-title.md`，序号递增。

## 废弃文档

不要直接删历史 ADR。在文首标记 `Status: superseded`，并链接到新 ADR。
