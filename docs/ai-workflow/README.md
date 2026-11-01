# AI 全栈工作流

本目录定义 go-react-admin 的 **AI 全栈标准作业流程（SOP）**。  
目标：同一套阶段、同一套完成标准，可重复交付「租户安全 + 多应用可扩展」的前后端改动。

## 阶段一览

```text
Intake → Plan → Implement → Verify → Document → Handoff
  ①       ②        ③          ④         ⑤          ⑥
```

| 阶段 | 文档 | 产出物 |
|------|------|--------|
| ① Intake | [00-overview.md](./00-overview.md) · [01-intake.md](./01-intake.md) | 问题陈述、范围、约束、成功标准 |
| ② Plan | [02-plan.md](./02-plan.md) | 方案、影响面、任务拆分、风险 |
| ③ Implement | [03-implement.md](./03-implement.md) | `server/` + `web/`（+ 必要 `deploy/`）代码 |
| ④ Verify | [04-verify.md](./04-verify.md) | 验证证据（命令、结果、边界用例） |
| ⑤ Document | [05-document.md](./05-document.md) | `docs/` 各级更新 |
| ⑥ Handoff | [06-handoff.md](./06-handoff.md) | 交付摘要、未决事项、下一步 |

## 配套文档

- [roles.md](./roles.md) — AI 角色与何时切换
- [definition-of-done.md](./definition-of-done.md) — 完成定义（DoD）
- [prompts/](./prompts/) — 可复用提示词

## 硬性规则（AI 必须遵守）

1. **先文档地图，后写代码**：新会话先读 [../README.md](../README.md)。
2. **租户隔离不可破**：查询/写入必须带租户 scope；见 [../architecture/tenancy.md](../architecture/tenancy.md)。
3. **平台与应用分离**：平台能力进 `platform/`，业务进 `apps/`；见 [../architecture/multi-app.md](../architecture/multi-app.md)。
4. **全栈默认双侧**：除非用户明确只要一端，否则 server + web 一起规划。
5. **无证据不宣称完成**：至少有构建/测试/手工验证之一的结果。
6. **文档回写**：行为变更必须更新 `docs/` 对应层级。

## 推荐启动话术（给人类）

```text
按 docs/ai-workflow 执行：<功能简述>
范围：server + web
约束：<租户/权限/兼容性>
成功标准：<可验证的结果>
```

更细的模板见 [prompts/](./prompts/)。
