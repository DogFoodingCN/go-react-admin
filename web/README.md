# Go-React-Admin · web

方案 A：Vite + React + TypeScript + Ant Design + ProComponents + React Router + TanStack Query + Zustand。

约定见 [`docs/web/conventions.md`](../docs/web/conventions.md)。

## 命令

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build
pnpm preview
```

## 目录

```text
src/
  app/         # providers、router、ProLayout 适配
  platform/    # 平台页（登录、租户、应用、IAM、审计）
  apps/demo/   # 示例业务应用
  shared/      # api / auth / tenant / access / ui
```

开发时 `/api` 代理到 `http://localhost:8080`（见 `vite.config.ts`）。
