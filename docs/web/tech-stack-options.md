# 前端技术栈选型（后台系统）

- Status: **已拍板 → 方案 A**
- Date: 2026-11-01
- 约束：多租户、多应用、Go API 分离、管理后台（偏 SPA）
- 决策：[ADR 0002](../architecture/adr/0002-frontend-stack.md) · 约定：[conventions.md](./conventions.md)

本文保留候选对比，供日后复盘；现行实现以 ADR / conventions 为准。

## 1. 选型标准（按权重）

| 权重 | 标准 | 说明 |
|------|------|------|
| 高 | 后台密度与效率 | 表格、表单、筛选、批量操作、布局（侧栏+顶栏）成熟 |
| 高 | 权限 / 动态菜单 | 易对接后端下发的菜单与权限码 |
| 高 | 多应用可拆分 | `platform` 与 `apps/<code>` 可隔离，避免巨石页面耦合 |
| 中 | 与 Go API 协作 | SPA + OpenAPI/手写 client 即可；不强制 SSR |
| 中 | AI / 团队可维护 | 文档全、约定清晰、组件 API 稳定 |
| 中 | 中文社区与交付速度 | 国内 B 端资料、样例、招聘友好度 |
| 低 | 视觉差异化 | 后台通常接受「稳」；除非要做品牌化控制台 |
| 低 | SSR/SEO | 登录后控制台基本无 SEO 需求 |

**明确不优先**：Next.js 全栈、与 Go 抢 BFF、过早上微前端。

---

## 2. 推荐方案总览

| 方案 | 一句话 | 适合 |
|------|--------|------|
| **A. React + Vite + Ant Design（+ ProComponents）** | 国内后台默认解 | 要最快做出可用中后台 |
| **B. React + Vite + shadcn/ui + TanStack** | 现代可定制设计系统 | 要统一多应用 UI、长期打磨体验 |
| **C. Refine + Ant Design（Vite）** | 管理端框架加速 CRUD | 大量标准资源型页面、想少写样板 |
| **D. Umi Max / Ant Design Pro** | 约定式全家桶 | 团队已熟 Umi、接受框架锁定 |
| **E. Vue3 + Element Plus / Naive UI**（备选） | Vue 生态后台 | 团队主栈是 Vue；与当前仓库「React」定位冲突 |

仓库名与架构文档已按 **React** 叙述，正式方案建议在 **A / B / C** 中选；D 仅在团队强依赖 Umi 时考虑。

---

## 3. 方案详述与优劣

### 方案 A — React + Vite + TypeScript + Ant Design 5 + ProComponents

**建议搭配**（含官方文档）

| 层 | 选型 | 文档 |
|----|------|------|
| 构建 | Vite | [vitejs.dev](https://vitejs.dev/) · [中文](https://cn.vitejs.dev/) |
| 语言 | TypeScript | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) |
| UI 框架 | React | [react.dev](https://react.dev/) |
| UI 组件 | Ant Design 5（`antd`） | [ant.design](https://ant.design/components/overview-cn) |
| 中后台组件 | ProComponents（ProTable / ProForm / ProLayout） | [procomponents.ant.design](https://procomponents.ant.design/) |
| 路由 | React Router 6/7 | [reactrouter.com](https://reactrouter.com/) |
| 服务端状态 | TanStack Query | [tanstack.com/query](https://tanstack.com/query/latest) |
| 客户端状态 | Zustand（租户、布局、用户极少全局态） | [zustand 文档](https://zustand.docs.pmnd.rs/) · [GitHub](https://github.com/pmndrs/zustand) |
| 请求 | 统一 client：`fetch` 或 axios（注入 token + tenant） | [MDN fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) · [axios](https://axios-http.com/docs/intro) |
| 表单校验 | antd Form 规则；复杂场景可加 Zod | [antd Form](https://ant.design/components/form-cn) · [Zod](https://zod.dev/) |
| 图表（可选） | Ant Design Charts 或 ECharts | [charts.ant.design](https://charts.ant.design/) · [echarts.apache.org](https://echarts.apache.org/zh/index.html) |
| 包管理 | pnpm | [pnpm.io](https://pnpm.io/) · [中文](https://pnpm.io/zh/) |

**优势**

- 表格/表单/布局开箱即用，CRUD 最快
- 权限、菜单、ProLayout 与中后台心智匹配
- 国内案例与 AI 训练语料多，交付可预期
- 与「先跑通租户开通 + demo 应用」路径兼容

**劣势**

- 视觉同质化；深度定制主题成本不低
- ProComponents 抽象有时「魔法」偏多，复杂多应用壳要克制使用
- 包体偏大（可用按需与拆包缓解）
- 多应用设计系统难做出强品牌差异

**风险点**：ProLayout 与「后端下发多应用菜单」要尽早做薄封装，避免业务页依赖 Pro 私有数据结构。

---

### 方案 B — React + Vite + TypeScript + shadcn/ui + Tailwind + TanStack

**建议搭配**

| 层 | 选型 |
|----|------|
| 构建 | Vite |
| UI | shadcn/ui（Radix）+ Tailwind CSS |
| 表格 | TanStack Table |
| 路由 | TanStack Router 或 React Router |
| 服务端状态 | TanStack Query |
| 客户端状态 | Zustand |
| 表单 | React Hook Form + Zod |
| 包管理 | pnpm |

**优势**

- 组件源码在仓库内，多应用共享 `packages/ui` 很自然
- 样式与无障碍定制强，适合长期平台产品
- 与现代 React 生态一致，AI 改组件友好
- 无强框架锁定，目录可平滑升到 workspace

**劣势**

- **后台密度组件要自己拼**：高级表格、查询表单、布局要投入初始基建
- 前期速度慢于 Ant Design；无 ProTable 等价物时易重复造轮子
- 权限/菜单/布局需自研约定（对本项目其实可接受，因多应用本就要定制）
- 团队若偏「业务交付」而非「设计系统」，容易半途而废

**风险点**：必须先做 `AppShell`（布局 + 菜单 + 权限 + 租户条）再写业务，否则各 app 会分叉。

---

### 方案 C — Refine + Vite + Ant Design（或 Mantine）

**建议搭配**

| 层 | 选型 |
|----|------|
| 框架 | [Refine](https://refine.dev) |
| UI | Ant Design 数据提供者 / 或 Mantine |
| 数据 | `dataProvider` 对接 Go REST |
| 权限 | Refine `accessControlProvider` |
| 路由 | Refine 路由集成 |

**优势**

- Resource 模型贴近「后台资源 CRUD」
- 列表/创建/编辑页样板少，access control 有现成钩子
- 仍可用 Vite，不必上 Next
- 多 dataProvider 对「按应用拆 API 前缀」有一定亲和度

**劣势**

- 多应用「壳 + 开通」不完全是 Refine 的一等模型，要自己架
- 团队要学 Refine 约定；偏离 CRUD 的复杂页可能别扭
- 抽象层出问题时代价高于「薄封装 antd」
- 国内资料少于纯 antd / Umi

**风险点**：平台级页面（租户、应用开通、审计）与 Refine resource 混用时边界要先画清。

---

### 方案 D — Umi Max / Ant Design Pro

**建议搭配**：Umi 4 + Ant Design Pro / Max 插件集（权限、request、layout、i18n）。

**优势**

- 约定式：路由、权限、初始数据、布局一条龙
- 对「标准企业后台」极熟的团队效率高

**劣势**

- **框架锁定强**，与「多应用可插拔、目录自治」摩擦大
- 定制构建/路由/多入口成本高
- 与「Go 独立 API + 清晰 packages」长期演进不如 Vite 裸项目干净
- 问题排查常陷入 Umi 插件链

**结论**：仅当团队已有 Umi 资产且接受锁定时选；**本仓库默认不推荐**。

---

### 方案 E — Vue 3 + Vite + Element Plus / Naive UI（备选）

**优势**：Element/Naive 后台组件成熟；部分团队更熟 Vue。  
**劣势**：与现有 `go-react-admin`、架构文档中的 React 不一致；全栈 AI 工作流与模块地图需整体改写。  
**结论**：**除非团队否决 React，否则不纳入正式候选。**

---

## 4. 对照本项目需求的匹配度

| 需求 | A Ant Design | B shadcn | C Refine | D Umi |
|------|:------------:|:--------:|:--------:|:-----:|
| 快速出平台壳 + CRUD | ★★★★★ | ★★★ | ★★★★★ | ★★★★★ |
| 多应用目录隔离 | ★★★★ | ★★★★★ | ★★★ | ★★ |
| 动态菜单 + 权限码 | ★★★★★ | ★★★★（自建） | ★★★★ | ★★★★★ |
| 租户上下文注入 | ★★★★ | ★★★★★ | ★★★★ | ★★★★ |
| 长期设计系统 / 定制 | ★★★ | ★★★★★ | ★★★ | ★★ |
| AI 辅助改码友好度 | ★★★★ | ★★★★★ | ★★★ | ★★★ |
| 框架锁定风险 | 低 | 极低 | 中 | 高 |
| 学习/基建成本 | 低 | 中高 | 中 | 低（若已会） |

---

## 5. 建议结论（供拍板）

### 默认推荐：**方案 A**

理由：本阶段目标是通用多租户多应用**后台**，首要矛盾是「快而稳地做出平台能力 + demo 应用闭环」，不是品牌化营销站。Ant Design / ProComponents 对表格表单密度、布局、权限菜单最省基建。

落地时注意：

1. **ProLayout 做适配层**，菜单结构以后端为准。
2. 业务应用放 `src/apps/<code>`，只依赖 `shared`，不依赖其它 app。
3. 数据请求统一走 TanStack Query + 带 tenant/auth 的 client。
4. 全局状态压到最小（Zustand：用户、当前租户、布局折叠等）。

### 若更看重中长期 UI 资产：**方案 B**

在已有前端人力可投入 1–2 周做 AppShell + DataTable + PageForm 基建时选 B；与后续 `web/packages/*` workspace 最契合。

### 若标准 CRUD 占比极高：**方案 C**

在 A 的 UI 之上用 Refine 减样板；平台壳仍建议自研一层，避免 Refine 渗透到租户/应用开通领域。

---

## 6. 与目录约定的关系

无论 A/B/C，均保持 [conventions.md](./conventions.md) 的分层：

```text
platform/   → 租户、应用、IAM、审计
apps/<code>/ → 业务应用
shared/     → ui 封装、api、auth、tenant
```

方案 B 更易升到 `apps/console + packages/*`；方案 A/C 可先单仓，待第二个应用再拆 packages。

---

## 7. 拍板清单

- [x] **A**：Vite + React + TS + antd + ProComponents + React Router + TanStack Query + Zustand
- [ ] **B**：Vite + React + TS + shadcn + Tailwind + TanStack（Query/Table/Router）+ RHF + Zod + Zustand
- [ ] **C**：Vite + React + TS + Refine + Ant Design + TanStack Query（按 Refine 集成）
- [ ] **D**：Umi Max / Ant Design Pro（需书面接受框架锁定）

已执行：`conventions.md`、ADR-0002。下一步：按方案 A 搭建 `web/` 脚手架。
