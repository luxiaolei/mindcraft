# 实施行动计划 / Milestones

更新：2026-11-11。里程碑是**目标与顺序**，不是“已经交付”的宣称。具体状态以 [验证记录](VERIFICATION.md) 和 Issues 为准。

| 阶段 | 主要交付 | 完成定义（Go/No-Go） | 预计工作量* |
|---|---|---|---|
| M0 — Fork & Spec | 公开 fork、MBP 克隆、PRD/架构/验收/风险、可检查配置 | 文件可读、机器和 Git 连接验证、CI 通过 | 1–2 工程日 |
| M1 — Game Loop | Paper + Mindcraft 本地 Compose；AI 入服、英语文本、跟随、找树 | 3 次独立完整实机测试无致命问题，命令限制生效 | 2–5 工程日 |
| M2 — Realtime Voice | 浏览器/桌面麦克风、流式 ASR/LLM/TTS 或一体化 Realtime、打断 | P90 首响 <2 秒（目标）、100 次语音轮次无系统性失效 | 4–8 工程日 |
| M3 — Mission & Events | 服务端儿童动作事件 + 任务状态机：木头→木屋 | 关键事件准确率≥95%，AI 代做不算孩子完成 | 4–8 工程日 |
| M4 — Learner Adaptation | 家长配置英语分级、尝试证据、建议、删除 | 证据可追溯、重复尝试去重、跨会话生效、撤回重算 | 4–7 工程日 |
| M5 — Small Family Trial | 隐私告知、权限、日志脱敏、真实家庭测试 | 安全和许可核查通过，完整人工验收后才试点 | 另估 |

*粗略工程估算，前提是上游兼容、模型账户和 Minecraft EULA/许可已解决；不是排期承诺。不同阶段可并行设计，但不可跳过验收。

## M0 本次范围
- [x] 找到 MBP 并认证 SSH 连接；确认 Apple Silicon、Git、开发目录。
- [x] GitHub 公开 fork：luxiaolei/mindcraft；MBP 上独立克隆与 upstream remote。
- [x] 新增 PoC 配置、角色与设计文档并在 MBP 运行静态检查；GitHub 推送单独验证。
- [x] 本地 Node 14 项测试、Compose 静态配置验证通过；GitHub CI 等待远端执行。

## M1 手动演示脚本
1. 经操作者确认 Minecraft EULA 后启动隔离 Compose，确认 server 1.21.6 可以运行。
2. 孩子使用正版 Java 客户端连接（测试环境可用本机/SSH 隧道）。
3. 在 player list 里出现孩子和 Buddy，AI 能接收到英语文本。
4. 玩家输入 “Find wood”；机器人检查范围内游戏状态；有树就带路，无树就如实说需要搜索。
5. 玩家自己采木、造木板；AI 不代做关键动作，能够应对 “stop”。
6. 录制屏幕作为内部验证资料前征得测试者同意；不收集无关的儿童个人资料。

## 优先级和前置阻断
- **Blocker 1**：Docker Desktop daemon 未启动；需要实机启动与版本兼容检查。
- **Blocker 2**：服务端 EULA 需由有权限的操作者明确接受；仓库默认 FALSE。
- **Blocker 3**：正式 AI LLM API key/账号未配置（不得提交到 git）。
- **Blocker 4**：本机离线验证与可商业运营的公开服务是不同命题，不能混同。
- **Blocker 5**：真实语音和儿童用户合规需要供应商/产品审核，不能由 PoC 自动满足。

## 开发规范
每个 Issue 包含背景、实现范围、测试、完成证据；不直接开启 insecure coding；所有外部动作用白名单；默认小步 PR；保留上游 remote 并追踪兼容性；至少提供一条可复现验证命令与真实结果。