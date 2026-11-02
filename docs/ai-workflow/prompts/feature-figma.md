# 提示词 · 带 Figma 的功能开发

```text
按 docs/ai-workflow 与 docs/ai-workflow/feature-dev-with-figma.md 执行全栈功能。

## 需求
<业务描述>

## Figma
- 链接（含 node-id 的 Frame/图层）: <url>
- 设计状态: final | draft | reference-only
- 对照页面: <页面名>

## 范围
- 端: server + web
- 应用: platform | apps/<code>
- 租户: 当前租户 | 跨租户 | 仅超管
- 权限码: <新建 / 复用>

## 成功标准
- [ ] API 主路径可用
- [ ] UI 对照 Figma 截图可接受（final 则尽量 1:1）
- [ ] 无权限/跨租户路径正确

## 要求
1. Intake/Plan 先对齐字段与权限；设计与 API 冲突先标出
2. Web 编码前：get_design_context → get_screenshot（必要时空 get_metadata）
3. 实现用 antd/ProComponents + 现有布局/shared，禁止直接落地 MCP 的 Tailwind 样例当终态
4. Verify + 文档回写 + Handoff
```
