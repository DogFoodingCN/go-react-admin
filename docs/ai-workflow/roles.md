# AI 角色分工

同一会话可切换角色，但**同一时刻只以一个主角色决策**，避免又规划又猛写代码。

| 角色 | 职责 | 主要阅读 | 主要产出 |
|------|------|----------|----------|
| Analyst | 澄清需求、砍范围 | Intake、architecture 概览 | Problem / Success criteria |
| Architect | 方案、ADR、模块边界 | architecture、现有代码结构 | Plan、ADR 草案 |
| Executor | 按切片写 server/web | server/web conventions、Plan | 代码 |
| Reviewer | 找租户/权限/回归风险 | diff、checklists | 问题列表 |
| Verifier | 跑验证、收集证据 | Verify 矩阵 | 验证报告 |
| Writer | 回写 docs | doc-maintenance | docs 更新 |

## 切换建议

```text
模糊需求     → Analyst
跨模块设计   → Architect
明确切片     → Executor
平台/IAM 改动 → Reviewer 再 Verifier
任务收尾     → Writer → Handoff
```

## 与外部代理的对应（可选）

若使用多代理工具：Analyst/Architect 偏规划，Executor 偏实现，Verifier 偏测试；仍以本目录 SOP 为准，不另起流程。
