# 02 · Plan（规划与拆分）

## 目标

产出可执行方案与任务切片；大改动先对齐 architecture，再动手。

## 必做分析

1. 读相关 docs：`architecture/` + `server/` + `web/`（按触及面）。
2. 搜索现有模块：是否已有类似能力可复用。
3. 画出数据流（简版即可）：

```text
UI → API → service → repo → DB（含 tenant_id）
         ↘ audit / permission check
```

4. 列出 schema / 权限码 / 菜单路由变更。
5. 风险：多租户串数据、越权、破坏现有应用注册。

## 输出模板

```markdown
## Approach
<选定方案 + 为何不选备选>

## Impact
- platform: 
- apps: 
- migrations: yes/no
- docs: 

## Tasks（垂直切片，建议 30–90 分钟粒度）
1. [ ] server: …
2. [ ] web: …
3. [ ] verify: …
4. [ ] docs: …

## Open questions
-
```

## 设计升级门槛

出现以下任一情况，先更新或新增 ADR（`docs/architecture/adr/`），再实现：

- 租户隔离策略变更
- 权限模型变更（RBAC 结构、权限码规则）
- 应用注册/挂载机制变更
- 跨应用共享数据模型

## 出口条件

- [ ] 任务列表可独立验证
- [ ] 租户 scope 方案明确
- [ ] 前后端契约（字段/错误码/权限）已写清
- [ ] 进入 [03-implement.md](./03-implement.md)
