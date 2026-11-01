# 04 · Verify（验证）

## 目标

用证据证明 Success criteria 达成；特别覆盖**租户隔离**与**权限拒绝**路径。

## 最低验证矩阵

| 类型 | 何时 | 示例 |
|------|------|------|
| 构建 | 每次 | `go test ./...`、前端 `pnpm build` / `npm run build` |
| 单测/集成 | 有逻辑分支 | service 权限、tenant scope |
| 手工 API | 有新接口 | curl/httpie 带 token + tenant header |
| 手工 UI | 有界面 | 开开应用、切换租户、无权限账号 |
| 回归 | 改平台内核 | 登录、菜单加载、已有 demo 应用 |

## 租户安全必测（有数据读写时）

- [ ] 租户 A 创建的数据，租户 B 的 token **不可读/不可改**
- [ ] 缺失/伪造租户上下文时请求失败（明确错误）
- [ ] 平台超管操作（若有）有独立审计

## 权限必测

- [ ] 有权限：可完成主路径
- [ ] 无权限：API 403/业务码拒绝，UI 无入口或禁用

## 证据格式（交付时粘贴）

```text
Command: …
Result: pass/fail + 关键输出摘要
Manual: …
```

## 出口条件

- [ ] Success criteria 全部勾选或明确延期
- [ ] 失败项有根因或 issue
- [ ] 进入 [05-document.md](./05-document.md)
