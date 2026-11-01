# 提示词 · 新业务应用

```text
按 docs/ai-workflow 新增一个可开通的业务应用（全栈）。

## 应用
- 代号：<app_code，小写 snake 或 kebab，与目录名一致>
- 显示名：
- 一句话职责：

## 首个垂直切片（MVP）
- 功能：
- 成功标准：
  - [ ] 平台可注册该应用
  - [ ] 租户可开通
  - [ ] 开通后菜单可见且主路径可用
  - [ ] 未开通租户不可见/不可调 API

## 要求
1. 阅读 docs/architecture/multi-app.md 与 tenancy.md
2. Plan 中列出：server/internal/apps/<code>、web 对应目录、权限码前缀、菜单
3. 实现后更新：
   - docs/server/module-map.md
   - docs/web/module-map.md
   - docs/architecture/multi-app.md（应用清单）
4. Verify 含「未开通租户拒绝」
5. Handoff 交付
```
