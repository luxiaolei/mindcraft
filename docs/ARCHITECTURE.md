# AI English Co-Player — 系统架构与接口

状态：设计稿 v0.1；实现情况以 [验证记录](VERIFICATION.md) 为准。

## 1. 可部署拓扑
Mac mini（Axel mini）通过可信 SSH 到 **MBP/xlmbp**；MBP 作为主要开发与容器宿主。孩子可在 MBP 上运行 Minecraft Java 客户端；若客户端在 Axel mini，则通过 SSH 端口转发连接 MBP 的 localhost Minecraft 端口。PoC **不对公网开放**。

    [Minecraft Java 客户端] <--TCP/25565 via loopback/tunnel--> [Paper 私服容器]
                                                               <--> [Mindcraft 容器：Mineflayer Bot]
                                                                        |
                                                                 [LLM API / 工具控制]
    [以后：麦克风网页] <--低延迟音频--> [Voice Gateway] <---> [教学编排/安全策略]
                                                               ^           |
                                                               |      [证据与进度数据]
                                                           [游戏事件适配器]

## 2. 复用与新增
- **上游复用**：Mindcraft 的 Mineflayer 行走、采集、常用命令、LLM 路由、现有单向 TTS、可选机器人视角和记忆。现有 TTS **不等于**持续双向实时语音。
- **PoC 已新增/规划**：独立 Compose、英文角色 profile、命令禁用配置、离线教学策略与测试、分阶段文档；真正的音频桥和稳定的事件采集适配器在后续阶段。
- **Minecraft 服务端**：优先 Paper Minecraft Java 1.21.6（与 Mindcraft 文档建议版本对齐）；初期本地隔离，不安装不可信 Mod。
- **AI 独立角色**：Mineflayer 以 Minecraft 协议的玩家身份加入。身份、动作权限、对话对象要由服务端校验。国际公开服务器模式须合法的 Microsoft/Minecraft 账户及 online-mode。

## 3. “看到游戏”和“看屏幕”不是一回事
Mineflayer 默认可观测自身及邻近实体、方块、库存和接收到的游戏消息；**不等于可靠知道孩子的完整库存、UI、屏幕视野和每次合成**。P1 增加 Paper 插件/服务器事件采集（位置、挖掘、放置、合成、拾取、任务进度），通过授权玩家 UUID 区分归属。可选玩家屏幕分享需要独立同意、明确界面和自动关闭，不能悄悄截图。

## 4. 双向语音设计（尚未接入）
- MVP 第一阶段先用 Minecraft 文本聊天证明“世界感知→动作→反馈”。
- P1 在 Mac/浏览器上用麦克风 + 低延迟实时语音 API；兼容全双工打断、VAD、输入转写、输出音频、取消正在播放的响应。
- Voice Gateway 将**已授权用户的语音转写**与少量最新游戏状态组成上下文，交给统一教学编排；编排输出“英语短句 + 允许的游戏动作候选”。
- 每项动作经过强类型校验、速率限制、距离/区域判断、玩家权限、任务规则后执行；不得让模型生成 JS 执行（Mindcraft allow_insecure_coding 必须为 false，阻断 !newAction）。
- 不应把长视频或全量游戏录屏作为默认输入；若确需视觉，按事件触发、用户同意、采样限额进行。

## 5. 建议的语义事件契约（计划实现）
事件 envelope：event_id、session_id、actor_player_uuid、event_type、world_tick、timestamp、payload、source。event_type 仅白名单，如 player_join、block_break、item_pickup、item_craft、block_place、chat_utterance。服务端只采集必要事件；P0 先用机器人侧有限观察，不伪称玩家完整状态。

示例：

    {"event_id":"evt-001","session_id":"trial-1","actor_player_uuid":"local-test-user",
     "event_type":"block_break","world_tick":881,"payload":{"block":"oak_log","count":1},
     "source":"paper_plugin"}

教学事件：attempt_id、skill_id、task_id、assistance_level、outcome、evidence_event_ids。去重后才能更新知识状态；只保存可解释证据，不生成固定人格标签。见 [学习者模型](LEARNER_MODEL.md)。

## 6. 多人与用户会话
PoC：MBP 私人本机端口 + 未验证身份的离线模式，仅用于自己与授权测试玩家；严禁公网暴露。正式服务：online-mode=true、实名/监护人同意流程（按司法辖区）、一个孩子关联受管会话、独立世界/机器人或严格的会话隔离、平台使用条款与抗滥用审核。

## 7. 安全与运行
- Docker Desktop / Compose；Minecraft 25565 和 Mindcraft 管理 8080 仅绑定 127.0.0.1。
- 所有 secrets 放在 gitignore 的 keys.json 或部署密钥服务；日志脱敏；启动时不打印 token。
- 默认关闭任意代码动作、新对话目标和攻击玩家；最小授权，用户说 stop 立即中止动作/语音；每会话时长与预算硬限制。
- MBP Docker 当前未运行；不得把 Compose 配置写成已验收部署。
- 最小保留、家长删除与音频供应商条款评估详见 [安全与许可](SECURITY_AND_LICENSE.md)。

## 8. 架构决策
ADR-001 选 Java + Mineflayer 而非 Education（教育版持续音频接入尚不明朗）。
ADR-002 先本地 Compose，后云端。
ADR-003 不以截图替代游戏事件；视觉作为明确授权后的补充。
ADR-004 教学策略与游戏工具解耦，以便未来迁移至其他游戏。
ADR-005 不默认要求 Vivix 或数字人视频。