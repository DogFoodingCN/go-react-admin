# 部署文档

对应目录：`deploy/`。

| 文档 | 说明 |
|------|------|
| [environments.md](./environments.md) | 环境划分与配置约定 |

## 目标内容（随落地补充）

- Docker 构建：`Dockerfile.server` / `Dockerfile.web`
- 本地编排：`docker-compose.yml`
- 密钥与环境变量：仅 example，真值走密钥管理

## AI 指引

变更端口、依赖服务、启动命令时，同步更新本目录与 example env，并在 Handoff 中说明。
