# 后端分层结构

- Status: Accepted（与脚手架同步）
- Date: 2026-11-01
- Relates: [ADR 0003](./adr/0003-backend-stack.md) · [server/conventions.md](../server/conventions.md)

## 请求路径

```mermaid
flowchart TB
  subgraph transport["① 传输层 Transport"]
    MW["Middleware<br/>RequestID / CORS / AuthJWT"]
    H["Handler<br/>绑定 DTO · 调 Service · 写 response"]
  end

  subgraph app["② 应用层 Application"]
    S["Service<br/>用例 · 规则（需求到来后填充）"]
  end

  subgraph infra["③ 基础设施 Infrastructure"]
    R["Repo<br/>GORM + db.WithTenant"]
    DB[(PostgreSQL)]
    JWT["shared/authjwt"]
  end

  Client["Web Client"] --> MW --> H --> S
  S --> R --> DB
  S --> JWT
```

## 依赖规则

1. Handler → Service → Repo（只允许向下）
2. Service / Repo **不得**依赖 Gin；租户/用户从 `context.Context`（`shared/ctx`）或显式参数获取
3. `apps/<code>` 之间禁止互相 import；共享能力进 `shared` 或调用 `platform` 的 service 接口（按需）
4. `bootstrap` 只做装配：构造 Deps、挂载 `module.Module`

## 包结构

```mermaid
flowchart LR
  API["cmd/api"] --> BOOT["bootstrap"]
  BOOT --> MOD["module.Module"]
  MOD --> PLAT["platform/*"]
  MOD --> APPS["apps/*"]
  PLAT --> SHARED["shared"]
  APPS --> SHARED
```

```text
internal/
├── bootstrap/           # NewRouter + 注册 Modules
├── module/              # Module 接口
├── config/
├── shared/
│   ├── middleware/
│   ├── authjwt/         # 签发/解析
│   ├── ctx/             # TenantID / UserID
│   ├── db/
│   ├── response|errors|pagination/
├── platform/<name>/
│   ├── module.go        # 实现 module.Module
│   ├── handler/
│   ├── service/
│   ├── repo/
│   ├── model/           # 可选占位
│   └── dto/             # 可选
└── apps/<code>/         # 同上
```

## 演进说明

当前各 service/repo 返回**示例数据**，不写真实业务。新需求按模块填充 service/repo，并补迁移与测试；不改变分层边界。
