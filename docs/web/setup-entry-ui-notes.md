# Setup 初始化页 · 前端实现要点（可复用）

- Status: Active
- Date: 2026-11-02
- Scope: `/setup` 入口页（`setup-entry`）与相关品牌壳；业务闸门见 [setup-before-login.md](../architecture/setup-before-login.md)
- Code: `web/src/platform/setup/pages/SetupPage.tsx` · `web/src/app/styles.css` · `web/src/shared/ui/AuthBrandLayout.tsx`

本文沉淀「Figma → 实现 → rem 化 → 视觉修边」过程中的**可复用决策**，避免下次同类页面重踩坑。

---

## 1. 两套壳，不要混用

| 阶段 | 壳 | 用途 |
|------|-----|------|
| 入口 / 登录 | `AuthEntryShell` + `AuthEntryCard` | 同一全屏构图：背景 SVG + 左侧品牌文案 + 右侧卡片；仅卡片内容不同 |
| 向导（DSN / 超管 / 完成） | `SetupWizardShell` | 顶栏 Logo + 居中卡片，**不是**入口左右构图 |

登录与 Setup 入口必须共用 `AuthEntryShell`，不要再各写一套背景/品牌区；向导不要再做成入口壳。

---

## 2. 入口页布局模型

### 2.1 画布

- 容器 `.setup-entry`：`width: 100%`、`min-height: 100vh`、`overflow: hidden`（窄屏改为 `overflow-x: hidden; overflow-y: auto`）。
- 高度链条：`html, body, #root, #root > .ant-app { height: 100% }`，否则 Ant App 下页面撑不满视口。
- 背景图 `.setup-entry__background`：按 Figma 用 `%` 偏移与放大（如 `top: -14.12%`、`width: ~107.58%`），裁掉 SVG 顶部透明带。

### 2.2 左侧品牌：用文档流串间距，忌双绝对顶

**问题**：`lockup` 与 `accent` 各自 `position: absolute` + `top: %` 时，容器高度变化与 rem 字号缩放不同步，**logo 下沿到 accent 的距离会漂**。

**做法**：包一层 `.setup-entry__brand-block`：

```text
brand-block (absolute: top/left 一次定位)
  └── lockup（logo + 标题）
  └── brand-copy
        └── accent
        └── h1 / p
```

- `brand-block`：`display: flex; flex-direction: column; gap: 1.75rem`（logo 下沿 → accent 上沿）。
- 调间距只改 `gap`；根字号变化时 `gap` 仍按 rem 同比缩放。
- 窄屏（`max-width: 980px`）隐藏 `brand-copy` / `features` / `geometry`，保留 lockup；`gap: 0`。

### 2.3 右侧卡片

- 卡片用 Figma 导出的**固定尺寸**（转 rem），不要用 `%` 撑白导致和稿面留白不一致。
- 窄屏：`left: 50%; transform: translateX(-50%)`，并设 `min-width` 与稿面一致。

---

## 3. rem 约定（全站自定义样式）

| 项 | 约定 |
|----|------|
| 基准 | `html { font-size: 16px }` → `1rem = 16px` |
| TS 工具 | `web/src/shared/style/rem.ts` → `rem(24)` ⇒ `'1.5rem'` |
| CSS | 布局/字号/阴影模糊半径等用 rem |
| 仍用 px | `±1px` 发丝线与防锯齿重叠；媒体查询断点（如 `980px`） |
| 不要硬改 | Ant Design API 数值（`gutter`、`Space size`、表格列 `width`、token `borderRadius`）——组件内部仍按 px |

React 内联样式里**单位数字会被当成 px**，必须写成 `rem(...)` 字符串。

整体缩放：只改 `html` 的 `font-size`，勿再给各组件写一套 px。

---

## 4. 静态资源

| 资源 | 位置 | 说明 |
|------|------|------|
| Setup 入口切图 | `web/public/brand/setup-entry/*` | background / geometry / accent / icons / button 等 |
| 品牌标 | `web/public/brand/logo-mark.svg` 等 | `BRAND_LOGO_SRC` |
| Favicon | `web/public/` + `index.html` 的 `<link rel="icon">` | `vite.svg` 是脚手架默认文件，**不是构建生成**；`dist/` 里是 `public/` 原样拷贝 |

logo 尺寸优先写在 CSS（rem），避免 JSX `width={}` / 内联 style 与 CSS 互相覆盖。

锁头白字若需「纯白无阴影」：可用 `filter: brightness(0) invert(1)`，并去掉过重的 `text-shadow`。

---

## 5. 已知坑与修法

### 5.1 最左侧竖白线

- **现象**：深蓝背景左缘一条浅色线。
- **原因**：Figma 导出 SVG 色块从 `x≈0.42` 起笔，左侧透明缝透出容器底色 `#edf3ff`。
- **修法**：
  1. SVG 路径左缘收到 `0`（或略负）；
  2. 背景图 `left: -1px` 并略加宽；
  3. 窄屏 `overflow-x: hidden`，避免加宽带来横滚。

勿把整个 `.setup-entry` 背景改成深蓝——右侧浅色区同样依赖浅底。

### 5.2 窄屏背景宽度

`@media (max-width: 980px)` 下背景可固定为稿面宽度的 rem 值（设计帧约 1440×894），与桌面 `%` 方案并存。

### 5.3 代理报错

`pnpm dev` 时 `/api/v1/setup/status` 出现 `ECONNREFUSED` = 后端未起，与 UI 无关。闸门会转圈或进 Setup，属预期。

### 5.4 指定库不存在

测连 / 初始化时服务端会先 Ensure：库不存在则 `CREATE DATABASE` 再连接（见架构文档 Setup 步骤）。前端无需改 DSN；账号需有建库权限。

---

## 6. 相关文件速查

```text
web/src/platform/setup/pages/SetupPage.tsx   # Setup 入口卡片 + 向导 Steps
web/src/platform/auth/pages/LoginPage.tsx    # 登录卡片（共用 AuthEntryShell）
web/src/app/styles.css                       # setup-entry* / auth-login* / rem / 窄屏
web/src/shared/style/rem.ts                  # rem()
web/src/shared/ui/AuthBrandLayout.tsx        # AuthEntryShell / AuthEntryCard / SetupWizardShell / BrandLockup
web/src/shared/setup/SetupGate.tsx           # 路由闸门
web/public/brand/                            # 品牌与 Setup 切图
```

---

## 7. 下次做同类页时的检查清单

- [ ] 入口全屏构图 vs 向导顶栏壳是否选对
- [ ] 需随缩放保持的垂直关系是否改成 **同一 flex 列 + rem gap**（而非双 absolute `%`）
- [ ] 新尺寸是否走 `rem()` / CSS rem；发丝线与断点是否仍用 px
- [ ] SVG 是否贴齐 `x=0`；左缘是否抽样看过浅色缝
- [ ] `html/body/#root/.ant-app` 高度是否打通
- [ ] favicon / logo 是否指向 `public/` 自有资源，而不是默认 `vite.svg`
