# ADR 0001 · 共享库 + tenant_id

- Status: Accepted
- Date: 2026-11-01

## Context

项目为通用多租户多应用后台。可选隔离：独立数据库、独立 schema、共享库行级 `tenant_id`。

## Decision

采用 **共享数据库 + 行级 `tenant_id`** 作为默认模型。

通过统一中间件与 DB scope 强制隔离；平台级跨租户操作单独授权并审计。

## Consequences

- 优点：运维简单、迁移成本低、适合中小规模与快速迭代
- 风险：应用层遗漏 scope 会导致串租；必须以清单与测试约束
- 后续：若出现强合规/超大租户，可对单租户演进到独立 schema/DB，并新开 ADR
