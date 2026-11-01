# 00 · 工作流总览与原则

## 产品定位（决策上下文）

- **形态**：通用多租户、多应用管理后台
- **技术**：Go API（`server/`）+ React 管理端（`web/`）
- **隔离默认**：共享库 + `tenant_id`（细节见 architecture）
- **扩展方式**：平台内核 + 可注册业务应用

## 原则

### 1. 契约优先于实现

先明确：租户边界、权限码、API 形状、菜单/路由归属应用。再写代码。

### 2. 垂直切片

优先按「用户可感知的小功能」切（例如「租户开通某应用」），而不是先堆完整分层脚手架。

### 3. 影响面显式化

每个 Plan 必须列出：

- 触及的平台模块（tenant / app / iam / auth / audit …）
- 触及的业务应用（`apps/<name>`）
- 是否需要 migration / 配置 / 文档

### 4. 可逆与可观测

破坏性变更（schema、权限模型、租户解析）必须有 ADR 或 architecture 更新，并说明回滚思路。

### 5. AI 会话状态

长任务用短状态块维护（可写在会话或 issue），字段建议：

```text
Goal / Phase / Done / Now / Next / Risks / Docs-touched
```

## 与仓库目录的映射

| 工作流关注点 | 代码 | 文档 |
|--------------|------|------|
| 租户解析、IAM | `server/internal/platform/*` | `docs/architecture/` |
| 业务功能 | `server/internal/apps/*` + `web/.../apps/*` | module-map |
| 横切中间件 | `server/internal/shared/*` | server conventions |
| 发布 | `deploy/` | `docs/deploy/` |
| 流程本身 | — | `docs/ai-workflow/` |

## 何时跳过阶段

| 场景 | 可压缩 | 不可跳过 |
|------|--------|----------|
| 改错别字/纯文案 | Intake+Plan 合并 | Document（若用户可见文案约定存在） |
| 单文件明确 bugfix | Plan 极简 | Verify |
| 新应用 / 权限模型变更 | — | 全阶段 + ADR |
