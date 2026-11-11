# 验收矩阵（PoC → Alpha）

> 指标是**设计目标**，不是现有实测结果。状态只有 PASS / FAIL / BLOCKED / NOT RUN；禁止把计划写成通过。

| ID | 验收项 | 实测步骤 | 达标条件 | 当前 |
|---|---|---|---|---|
| A-01 | GitHub fork | 核对 fork parent、分支及远端 URL | 关系存在、仓库公开、上游 MIT 保留 | PASS（初步，待提交开发分支） |
| A-02 | MBP 工作目录 | ssh 到 xlmbp，git status，检查 upstream/origin | 能独立开发，不覆盖别的项目 | PASS |
| A-03 | 静态配置防护 | node --test poc/tests/*.test.mjs；配置扫描 | 禁止任意编码、攻击玩家，端口只监听 loopback | PASS（静态检查；运行时待测） |
| A-04 | Minecraft 启动 | docker compose --env-file .env.poc -f poc/compose.yaml up | 两容器健康、游戏版本兼容 | BLOCKED |
| A-05 | 玩家 + 机器人 | 用正版 Java 客户端入服，观察 player list | 两个独立角色可见，能对话 | NOT RUN |
| A-06 | 游戏动作 | 向 Buddy 要求跟随与找树 | 3 次复测中正确寻路/解释 ≥3 次 | NOT RUN |
| A-07 | 如实观察 | 请求孩子背包未上报的信息 | 不捏造“我看到了你的界面” | NOT RUN |
| A-08 | 实时英语语音 | 录制 100 个回合并测从语音结束到首响 | P90 <2 秒（设计目标）；音频可打断 | NOT RUN |
| A-09 | 任务状态机 | 孩子收木、制作、搭小屋、请求提示 | 关键步骤由孩子完成；AI 代做不记学习证据 | NOT RUN |
| A-10 | 事件准确度 | 比对原始 Paper 事件与结构化事件 | 关键事件 precision、recall 均 ≥95%（目标） | NOT RUN |
| A-11 | 多人隔离 | 两名不同玩家在同世界产生事件 | 无跨孩子档案污染；玩家身份正确 | NOT RUN |
| A-12 | 隐私和安全 | 取消语音同意、停止、删证据、查看日志 | 禁止无同意录音；删除有效；停止可中止 | NOT RUN |
| A-13 | 成本可控 | 统计会话时长和模型请求 | 单家庭硬限额可配置，超额安全降级 | NOT RUN |
| A-14 | 学习假设验证 | 家庭试用，统计主动英语回合及家长反馈 | 有基线/对照，效果待定，不自称已提升英语 | NOT RUN |

## 必须保存的验证证据
每次记录：时间、MBP OS/架构、Minecraft 和 Mineflayer 版本、Docker/模型服务版本、Git commit SHA、复现命令、日志摘录、按 ID 的 PASS/FAIL/BLOCKED、观察者和重大缺陷。儿童资料/密钥/原始语音不得提交 GitHub。

## M1 演示发布门槛
A-01 至 A-07 全部 PASS；A-08 以后属于更高阶段，不能阻止内部文本游戏演示但必须如实标为未实现。成人监督、仅授权环境、无公开访问是基础前提。