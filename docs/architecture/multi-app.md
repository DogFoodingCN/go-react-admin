# 多应用模型（速查）

完整总览（管理 + 实现 + Mermaid）：**[tenancy-multi-app.md](./tenancy-multi-app.md)**。

## 目标

一套后台可挂载多个业务应用：平台负责注册与开通，应用负责领域功能。

## 生命周期

```text
注册应用定义 → 租户开通 → 菜单/路由生效 → 权限码可用 → 停用/卸载
```

## 约定

| 项 | 规则 |
|----|------|
| 应用代号 `app_code` | 小写，与目录名一致，如 `demo` |
| 后端路径 | `server/internal/apps/<app_code>/` |
| 前端路径 | `web/src/apps/<app_code>/` |
| 权限码前缀 | `<app_code>:` 例如 `demo:item:read` |
| 菜单 | 归属应用；未开通不下发（目标；现状静态菜单） |

## 应用清单

| app_code | 显示名 | 状态 | 说明 |
|----------|--------|------|------|
| demo | Demo 应用 | example | 示例列表 API/页面；开通校验与落库待需求 |

新增应用时：更新本表 + [../server/module-map.md](../server/module-map.md) + [../web/module-map.md](../web/module-map.md)。

## 平台 API 能力（目标）

- 应用定义 CRUD（平台超管）
- 租户-应用绑定（开通/停用）
- 按租户返回可访问应用、菜单、权限集

## AI 新增应用

使用提示词 [../ai-workflow/prompts/new-app.md](../ai-workflow/prompts/new-app.md)，并遵守本页与 [tenancy-multi-app.md](./tenancy-multi-app.md)。
