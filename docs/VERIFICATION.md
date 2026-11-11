# 验证记录 — 2026-11-11

下列是本轮实际观察；**不包含未执行的实机 Minecraft/儿童语音演示**。

| 检查 | 证据 / 结果 |
|---|---|
| 远程设备 | xlmini 在远程控制连接中 Online；主机 Darwin arm64 |
| 到 MBP 的 SSH | 使用 xlmbp 别名和已保存 SSH ED25519 指纹，publickey 登录成功；hostname=xlmbp，Darwin arm64 |
| MBP 主工作目录 | /Users/xlmbp/projects/mindcraft |
| 上游 | https://github.com/mindcraft-bots/mindcraft；默认 develop；MIT |
| Fork | https://github.com/luxiaolei/mindcraft；已建公共 fork |
| 基线提交 | e1c1fc3ffa481506c2445fc639e16dba504b5920（develop） |
| 开发分支 | feat/ai-english-coplayer-poc |
| 远端 | origin 指向个人 fork；upstream 指向原项目 |
| MBP 磁盘 | 本轮检查约 158 GiB 可用 |
| Docker | CLI 存在，但 Docker Desktop daemon 连接失败，**运行时未启动** |
| Node | MBP 有 Node 25（/opt/homebrew/bin/node）；上游提醒 Node 24+ 可能不兼容其原生依赖 |
| MBP GitHub CLI | 登录已失效；GitHub 操作使用 xlmini 已认证环境 |
| Minecraft 服务器 | NOT RUN：需先处理 Docker、EULA、密钥 |
| Compose 静态配置 | docker compose v2.15.1；config 成功解析，两个监听端口均为 127.0.0.1；此检查不需要 daemon |
| 游戏内 AI 角色 | NOT RUN |
| 本地核心测试 | node --test poc/tests/*.test.mjs：14 passed / 0 failed；离线样例 node poc/demo.mjs 输出符合预期 |
| 英语双向语音 | NOT IMPLEMENTED / NOT RUN |
| 游戏事件插件 / 真实学习档案 | NOT IMPLEMENTED / NOT RUN |

后续测试应追加日期、Git SHA、环境版本、复现步骤、脱敏日志与验收项状态，不能把目标阈值当成测试结果。