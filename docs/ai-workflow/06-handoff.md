# 06 · Handoff（交付与交接）

## 目标

用固定结构交付，方便人类审查与下一会话续作。

## 交付模板

```markdown
## Summary
<1–3 句：做了什么、为何>

## Changes
- server: …
- web: …
- deploy: …
- docs: …

## Verification
- …

## Tenant / Auth notes
- …

## Follow-ups
- [ ] …

## Risks
- …
```

## 会话续作钩子

若任务未完成，额外给出：

```text
Resume from: Phase <n> / Task <id>
Read first: <docs paths>
Blocked on: <问题>
```

## 出口条件

- [ ] 用户能仅凭 Handoff 理解变更与风险
- [ ] DoD 见 [definition-of-done.md](./definition-of-done.md) 已核对
