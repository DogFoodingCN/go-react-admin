# Plan 索引 · 登录前系统初始化

完整 Intake、方案与任务切片见：

**[../../architecture/setup-before-login.md](../../architecture/setup-before-login.md)**

要点（已定）：

- **DSN 由前端表单生成/填写**，经 `initialize` 提交；成功后服务端持久化  
- **默认超管账号由前端在初始化时设置**（用户名 + 密码）  
- 可选 `test-connection`；完成后锁定 Setup，再走登录  

实现话术：

```text
按 docs/architecture/setup-before-login.md 的 Plan 执行 Implement：切片 A → D
范围：server + web
约束：DSN+超管均来自 Setup 前端；勿把 DSN/密码写入 localStorage
```
