# 03 · Implement（全栈实现）

## 目标

按 Plan 的垂直切片实现；默认 **server → web**（契约先落地），必要时并行但保持 API 为真相源。

## 推荐实现顺序

1. **Migration / 模型**（若有）
2. **server**：repo → service → handler → 路由注册 → 权限码
3. **（有 Figma）Design sync**：`get_design_context` + `get_screenshot`（见 [feature-dev-with-figma.md](./feature-dev-with-figma.md)）
4. **web**：api client → 页面/表单（按稿映射到 antd/Pro）→ 路由与菜单 → 权限守卫
5. **横切**：审计日志、错误映射、i18n 文案（若项目已有）
6. **deploy/config**：仅当运行方式变化时

## 编码约束（摘要）

### Server

- 业务应用代码放 `internal/apps/<app>/`，平台能力放 `internal/platform/`
- 所有租户数据访问走统一 tenant scope（禁止遗漏 `tenant_id`）
- Handler 薄、Service 含业务规则、Repo 只持久化
- 细节：[../server/conventions.md](../server/conventions.md)

### Web

- 平台页面与 `apps/<app>` 页面目录分离
- 权限码与后端一致；无权限不展示可执行入口
- 租户上下文从统一 provider 读取，禁止页面私自写死租户
- 细节：[../web/conventions.md](../web/conventions.md)

## 实现中纪律

- 不为「以后可能」扩展抽象；保持与现有模块风格一致
- 不提交密钥；配置用 example + env
- 每完成一个切片就跑最小验证，避免堆到最后

## 出口条件

- [ ] Plan 中代码任务完成或已记录砍掉项
- [ ] 自检 [../server/checklist.md](../server/checklist.md) / [../web/checklist.md](../web/checklist.md)
- [ ] 进入 [04-verify.md](./04-verify.md)
