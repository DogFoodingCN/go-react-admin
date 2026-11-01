# 后端技术栈选型（管理后台 API）

- Status: **已拍板 → 方案 A**
- Date: 2026-11-01
- 约束：Go 语言、多租户（共享库 + `tenant_id`）、多应用模块、对接已定前端方案 A（SPA + REST）
- 决策：[ADR 0003](../architecture/adr/0003-backend-stack.md) · 约定：[conventions.md](./conventions.md)

本文保留候选对比（含 go-zero）；现行实现以 ADR / conventions 为准。

## 1. 选型标准（按权重）

| 权重 | 标准 | 说明 |
|------|------|------|
| 高 | 租户隔离可控 | 易做统一 `tenant_id` scope，难「漏过滤」 |
| 高 | 模块可拆 | 契合 `platform/*` + `apps/<code>` |
| 高 | REST/JSON 交付效率 | 与 React 管理端契约清晰、CRUD 快 |
| 中 | 国内资料 / AI 友好 | 样例多、排障快 |
| 中 | 可观测与运维 | 日志、迁移、配置、健康检查 |
| 低 | 极限性能 | 后台 QPS 通常不是首要矛盾 |
| 低 | 自带 Admin UI | 前端已自建，不依赖 Go 渲染后台页 |

**明确不优先**：GraphQL 先行、上 gRPC 做浏览器直连、过早微服务拆分、Fiber/`fasthttp`（与 `net/http` 生态摩擦）。

---

## 2. 推荐方案总览

| 方案 | 一句话 | 适合 |
|------|--------|------|
| **A. Gin + GORM + PostgreSQL** | 国内 Go 中后台默认解 | 要最快搭平台 + demo 应用 |
| **B. Chi（或 Gin）+ sqlc + pgx** | SQL 显式、租户更安全 | 更在意隔离正确性与可审计 SQL |
| **C. Echo + ent** | Schema 驱动领域模型 | 复杂实体关系、愿先写 schema |
| **D. 标准库 ServeMux + sqlc** | 零框架锁定 | 团队极熟 stdlib、接受自建更多轮子 |
| **E. go-zero** | 微服务全家桶 + goctl 生成 | 已定微服务/多服务治理，或团队已全员 go-zero |

仓库与目录已按 **Go 模块化单体** 叙述，正式方案建议在 **A / B** 中选；与 go-zero 的专项对比见 [§3.5](#35-方案-a-vs-go-zero)。

---

## 3. 方案详述与优劣

### 方案 A — Gin + GORM + PostgreSQL（默认推荐）

**建议搭配**（含官方文档）

| 层 | 选型 | 文档 |
|----|------|------|
| 语言 | Go 1.22+ | [go.dev/doc](https://go.dev/doc/) |
| HTTP | Gin | [gin-gonic.com](https://gin-gonic.com/docs/) · [GitHub](https://github.com/gin-gonic/gin) |
| ORM | GORM | [gorm.io](https://gorm.io/zh_CN/docs/) |
| 数据库 | PostgreSQL 16+ | [postgresql.org/docs](https://www.postgresql.org/docs/) |
| 迁移 | golang-migrate 或 goose | [migrate](https://github.com/golang-migrate/migrate) · [goose](https://github.com/pressly/goose) |
| 校验 | go-playground/validator（Gin 集成） | [validator](https://github.com/go-playground/validator) |
| 认证 | JWT（如 golang-jwt） | [golang-jwt](https://github.com/golang-jwt/jwt) |
| 配置 | 环境变量 + 可选 Viper | [viper](https://github.com/spf13/viper) |
| 日志 | `log/slog`（标准库）或 zap | [slog](https://pkg.go.dev/log/slog) · [zap](https://github.com/uber-go/zap) |
| 缓存（可选） | Redis | [redis-go](https://github.com/redis/go-redis) |
| API 文档（可选） | swaggo/swag | [swag](https://github.com/swaggo/swag) |
| 模块路径 | 单 module：`server/` | 见 [conventions.md](./conventions.md) |

**优势**

- 生态与国内案例最多，和前端 Ant Design 一样「出活快」
- 绑定、路由分组、中间件成熟，适合租户/鉴权横切
- GORM 对后台 CRUD、关联、分页友好
- AI 辅助写 Gin/GORM 命中率高

**劣势**

- GORM 动态 SQL **容易漏 `tenant_id`**，必须强制 DB scope / 回调 / 基类模型
- 复杂报表 SQL 不如手写 SQL 清晰
- 隐式行为多，排查 N+1、钩子副作用需纪律

**风险点（本项目必做）**：在 `internal/shared/db` 提供带租户的 Session；禁止业务直接 `db.Find` 裸查租户表。

---

### 方案 B — Chi + sqlc + pgx + PostgreSQL（租户安全向）

**建议搭配**

| 层 | 选型 | 文档 |
|----|------|------|
| HTTP | Chi v5（100% `net/http`） | [go-chi.io](https://go-chi.io/) · [GitHub](https://github.com/go-chi/chi) |
| 也可替换 | Gin 路由 + sqlc（折中） | 同上 Gin 文档 |
| SQL 层 | sqlc（生成类型安全 Go 代码） | [docs.sqlc.dev](https://docs.sqlc.dev/) |
| 驱动 | pgx / pgxpool | [pgx](https://github.com/jackc/pgx) |
| 迁移 | goose 或 golang-migrate | 同方案 A |
| 校验 | validator 或 ozzo-validation | [ozzo](https://github.com/go-ozzo/ozzo-validation) |
| 认证 / 日志 / 缓存 | 同方案 A | — |

**优势**

- SQL 显式，`tenant_id` 写在查询里，**隔离可审查、可单测**
- 与标准库中间件完全兼容，长期锁定低
- 性能与可预测性好；适合多应用各自维护 `queries.sql`

**劣势**

- CRUD 样板多于 GORM；改表要改 SQL + 再 `sqlc generate`
- 国内「开箱后台」教程少于 Gin+GORM
- 关联加载、动态筛选要自己设计约定

**风险点**：动态筛选（多条件列表）需统一 query builder 约定，避免每个 app 各写一套。

---

### 方案 C — Echo + ent + PostgreSQL

**建议搭配**

| 层 | 选型 | 文档 |
|----|------|------|
| HTTP | Echo | [echo.labstack.com](https://echo.labstack.com/docs/) |
| ORM/Schema | ent | [entgo.io](https://entgo.io/docs/getting-started) |
| 迁移 | ent migrate / Atlas / goose | [Atlas](https://atlasgo.io/) |
| 其余 | JWT + slog + Redis | 同 A |

**优势**

- Schema 即代码，生成 CRUD/边/校验，复杂领域模型强
- ent 可用 Privacy Policy 做租户级策略（契合多租户）
- Echo 错误处理模型干净（`error` 返回）

**劣势**

- 学习与生成流水线成本高于 A
- 与「快速 demo 应用」节奏略冲；团队需接受 codegen
- 生态心智不如 Gin 普及

**风险点**：Privacy 规则要集中维护；配错会导致「全放行」或「全拒绝」。

---

### 方案 D — net/http（Go 1.22+ ServeMux）+ sqlc

**优势**：零框架、标准清晰。  
**劣势**：路由分组、绑定、统一错误要自建较多；交付速度慢于 A/B。  
**结论**：本仓库**默认不推荐**，除非团队明确要极简依赖。

---

### 方案 E — go-zero（对照项）

**文档**：[go-zero.dev](https://go-zero.dev/) · [GitHub](https://github.com/zeromicro/go-zero) · [goctl](https://go-zero.dev/docs/tutorials/cli/installation)

**典型形态**

| 层 | go-zero 常见做法 |
|----|------------------|
| 定义 | `.api` / `.proto` 描述服务 |
| 生成 | `goctl` 生成 handler、logic、config、类型 |
| HTTP / RPC | 自带 rest + zrpc（gRPC） |
| 数据 | `goctl model` 生成（偏 SQL 模型，非 GORM 心智） |
| 治理 | 限流、熔断、降载、超时、链路、服务发现等内建 |
| 配置 | 框架约定的 yaml/json 配置结构 |

**优势**

- 微服务韧性能力开箱（熔断、限流、自适应降载）
- `goctl` 减少样板，API 定义 → 代码路径固定，团队规范统一
- 国内大厂/中后台微服务案例多，运维与治理文档全
- 同时做 HTTP + gRPC 时比自拼 Gin+grpc-go 省心

**劣势（相对本仓库目标）**

- **为微服务设计**：目录、配置、依赖偏「多服务」；做模块化单体时常感到框架过重
- 代码结构被 goctl 模板绑定，和文档里的 `platform/` + `apps/<code>` **要对齐需要改编生成物或二次封装**
- 数据层不是 GORM 一等公民；习惯 GORM 的团队迁移成本明显
- 学习面：`.api` 语法、goctl 版本、服务发现/etcd 等，比 Gin 陡
- 与「先单体、后按需拆服务」相比，一上来就带齐治理组件，心智与依赖都更重

---

### 3.5 方案 A vs go-zero

面向本项目：**多租户多应用管理后台、Go 模块化单体、已有 React SPA、暂不拆微服务**。

| 维度 | 方案 A（Gin + GORM） | go-zero |
|------|----------------------|---------|
| 定位 | HTTP API 框架 + ORM 组合 | 微服务框架（rest/rpc + 治理） |
| 与当前目录约定 | 自然贴合 `internal/platform`、`apps/*` | 默认 goctl 布局，需映射/改造 |
| 多租户 `tenant_id` | 自建 middleware + GORM scope（需纪律） | 同样要自建；无开箱「租户插件」，生成代码里仍要手补 |
| 多应用扩展 | 按包加路由组即可 | 可单服务多组 API，或拆多服务（后者更符合其设计） |
| 交付后台 CRUD | 快（GORM + 手写/少量工具） | 快（goctl），但要先写 `.api` 并接受生成结构 |
| 治理（限流熔断等） | 按需加中间件/组件 | **内建，这是主价值** |
| 框架锁定 | 中（Gin/GORM 可替换面大） | **高**（生成代码 + 运行时约定） |
| 依赖与复杂度 | 相对薄 | 相对厚 |
| 何时更划算 | 单体管理端、团队熟 Gin | 已定多服务、要统一治理、团队已 go-zero |

**结论（针对本仓库）**

1. **现阶段更匹配方案 A**：目标是单体后台 API，不是先上服务网格式治理；目录与前端契约更可控。  
2. **选 go-zero 的合理时机**：明确要拆 `tenant/iam/app` 为独立服务、需要统一熔断限流服务发现，或团队已有 go-zero 规范与脚手架资产。  
3. **不建议「单体却强行 go-zero」**：治理能力用不上时，只剩生成器与目录约束，性价比低于 Gin + GORM。  
4. 若未来从 A 演进：可把单个 `apps/<code>` **按需**抽成服务；那时再引入 go-zero/Kratos 等，比一开始全盘绑定更稳。

---

## 4. 横切能力（各方案共用建议）

| 能力 | 建议 | 说明 |
|------|------|------|
| 部署形态 | 模块化单体 `cmd/api` | 先不分微服务 |
| 租户 | 中间件注入 + DB scope | 见 [../architecture/tenancy.md](../architecture/tenancy.md) |
| 权限 | RBAC + 权限码字符串 | `platform:*` / `<app>:*` |
| 密码 | bcrypt / argon2 | 禁止明文 |
| 跨域 | 显式 CORS（开发代理已由 Vite 处理） | 生产按域名白名单 |
| 任务（可选） | 同进程 worker 或 asynq | 审计归档、邮件等 |
| 测试 | `httptest` + 测试库 / testcontainers | 租户串数据用例必测 |

**数据库选型说明**：默认 **PostgreSQL**（JSON/索引/后续可选 RLS）。若团队强绑定 MySQL 8，方案 A/B 均可换驱动，但需在 ADR 写明。

---

## 5. 对照本项目需求的匹配度

| 需求 | A Gin+GORM | B Chi+sqlc | C Echo+ent | D stdlib | E go-zero |
|------|:----------:|:----------:|:----------:|:--------:|:--------:|
| 快速出平台 API | ★★★★★ | ★★★★ | ★★★ | ★★ | ★★★★ |
| 租户 scope 安全性 | ★★★（需纪律） | ★★★★★ | ★★★★★ | ★★★★ | ★★★（需自建） |
| 多应用（单体内） | ★★★★★ | ★★★★★ | ★★★★ | ★★★★ | ★★★ |
| 微服务治理 | ★★ | ★★ | ★★ | ★ | ★★★★★ |
| CRUD / 分页效率 | ★★★★★ | ★★★ | ★★★★ | ★★ | ★★★★ |
| AI / 国内资料 | ★★★★★ | ★★★★ | ★★★ | ★★★ | ★★★★★ |
| 框架锁定 | 中 | 低 | 中 | 极低 | 高 |
| 与现有 web 对接 | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★ | ★★★★★ |
| 贴合本仓库目录约定 | ★★★★★ | ★★★★★ | ★★★★ | ★★★★ | ★★ |

---

## 6. 建议结论（供拍板）

### 默认推荐：**方案 A**

与前端选 Ant Design 同一逻辑：先跑通「租户 / 应用开通 / IAM / demo CRUD」。用 Gin 路由组 + GORM，在 `shared/db` **强制租户 Session**，并用 checklist / 测试守住隔离。

### 若更在意租户 SQL 可审计：**方案 B**

平台与各 `apps/<code>` 用 sqlc 分目录管理查询；HTTP 用 Chi 或仍用 Gin。

### 领域模型很重、愿上 codegen：**方案 C**

用 ent Privacy 表达租户策略；HTTP 用 Echo 或 Gin 均可（ADR 写清）。

### 已定微服务 / 团队已是 go-zero：**方案 E**

不要为「看起来更企业级」在单体阶段上 go-zero；等拆服务或治理成为刚需再选。

---

## 7. 与目录约定的关系

无论 A/B/C，均保持：

```text
cmd/api
internal/platform/*
internal/apps/<code>/{handler,service,repo}
internal/shared/{middleware,db,errors}
migrations/
```

- 方案 A：`repo` 多用 GORM model  
- 方案 B：`repo` 调 sqlc 生成代码  
- 方案 C：`repo`/domain 靠近 ent generated client  

---

## 8. 拍板清单（请选一项）

- [x] **A**：Go + Gin + GORM + PostgreSQL + migrate/goose + JWT + slog +（可选 Redis）
- [ ] **B**：Go + Chi（或 Gin）+ sqlc + pgx + PostgreSQL + migrate + JWT + slog
- [ ] **C**：Go + Echo + ent + PostgreSQL + JWT + slog
- [ ] **D**：Go stdlib ServeMux + sqlc
- [ ] **E**：go-zero（`.api` + goctl；接受微服务目录与治理栈）

已执行：`conventions.md`、ADR-0003、`server/` 脚手架（示例/占位，业务按需求迭代）。
