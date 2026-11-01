# 提示词 · 新功能

```text
按 docs/ai-workflow 执行全栈功能开发。

## 需求
<用业务语言描述>

## 范围
- 端：server + web（如只要一端请改这里）
- 应用：platform | apps/<name>
- 租户：当前租户 | 跨租户 | 仅超管

## 成功标准
- [ ] <可观察结果 1>
- [ ] <可观察结果 2>

## 约束
- 不改变租户隔离策略
- 权限码：<新建 / 复用 xxx>
- 其它：<兼容性、期限>

## 要求
1. 先 Intake/Plan，得到我确认后再 Implement（小改可合并征求一次确认）
2. Verify 必须覆盖租户隔离与无权限路径（若涉及）
3. 按 docs/ai-workflow/05-document.md 回写 docs
4. 最后用 Handoff 模板交付
```
