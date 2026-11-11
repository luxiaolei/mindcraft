# MBP 本地部署手册（开发者 / 技术验证）

机器：**MBP（xlmbp，Apple Silicon）**；Axel mini / xlmini 是远程入口。fork: https://github.com/luxiaolei/mindcraft 。此次建立的是 PoC 配置，不承诺已通过实机游戏验收。

## 1. 获取代码
在 MBP：

    cd ~/projects/mindcraft
    git remote -v
    git status

应看到 origin 指向 luxiaolei/mindcraft，upstream 指向 mindcraft-bots/mindcraft。不要直接修改上游。开发分支：feat/ai-english-coplayer-poc。

Axel mini 到 MBP 的已验证 SSH 别名是 xlmbp（它解析到私有网络地址）。若主机密钥变化，先核对指纹，**不要**盲目禁用 SSH 主机校验。

## 2. Docker 与游戏许可
先确认 Docker Desktop 已启动并有 Apple Silicon 兼容的 Compose：

    docker version
    docker compose version

首次运行服务器前，由有权限的操作者阅读 https://www.minecraft.net/en-us/eula ，并在自行接受后设定 .env.poc 中的 MINECRAFT_EULA=TRUE。仓库样例默认 FALSE，不能代理接受 EULA。

    cp .env.poc.example .env.poc
    cp keys.example.json keys.json

根据所选择的语言模型在 **不提交 Git 的** keys.json 中设置相应 API key。Mindcraft 的上游模型默认行为需查看 README 和 poc/english-buddy.json。不要把任何 token 传到聊天或 GitHub。

## 3. 启动文本游戏 PoC（语音尚未接入）

    docker compose --env-file .env.poc -f poc/compose.yaml config
    docker compose --env-file .env.poc -f poc/compose.yaml up --build -d
    docker compose --env-file .env.poc -f poc/compose.yaml ps
    docker compose --env-file .env.poc -f poc/compose.yaml logs --tail=150 mindcraft minecraft

游戏端口和管理网页只映射到 MBP 本机 loopback。此配置为单玩家 + Buddy 的封闭调试；ONLINE_MODE=false **禁止公开访问**。要停机：

    docker compose --env-file .env.poc -f poc/compose.yaml down

## 4. 孩子实际在哪里玩？
- 游戏在 **正版 Minecraft Java Edition 客户端**，不是 Docker 容器，也不是浏览器里仿真的游戏。
- 客户端若也在 MBP：多人游戏 → 直接连接 → localhost:25565。
- 客户端若在 Axel mini：在 Axel mini 上开 SSH 端口转发，例如：ssh -L 25565:127.0.0.1:25565 xlmbp ；然后游戏连接 localhost:25565。SSH 会话需保持开启。若本机 25565 被占用，使用其他本地端口映射。
- AI Buddy 作为独立玩家出现，先用游戏文字聊天测试 “Find wood”, “Follow me”, “Stop”。文字聊天不需要麦克风。
- 因离线身份模式无真实玩家校验，仅在完全可信的本地封闭环境测试。正式上线必须改为 online-mode 和合法机器人账号。

## 5. Mac 注意事项
上游项目推荐 Node 18/20 LTS，Node 24+ 的原生包可能有问题；MBP 系统上目前 Node 25，因此优先使用 Dockerfile 中的 Node 22 镜像构建 Mindcraft，避免直接 npm install 修改本机依赖。现有 MBP Docker Desktop 客户端版本偏旧且 daemon 未启动，若构建失败需更新/启动 Docker 并记录版本。Apple Silicon 镜像、Paper 1.21.6、Mindcraft 源码兼容性都必须经实机验证。

## 6. 开始前核对和故障排查
- 检查密钥文件被 git 忽略：git check-ignore keys.json .env.poc
- 检查 Docker daemon、内存和磁盘空间；Paper 首启需要较长初始化。
- 如果 Buddy 入服报认证或无法连接：核实 Mindcraft 容器内 host=minecraft，port=25565，auth=offline 与服务器 ONLINE_MODE=false。
- 若有 API 401：检查密钥权限/服务商，不要粘贴 token；模型名按供应商和 Mindcraft 版本核实。
- 若 Minecraft Java 客户端无法加入：确认游戏版本 1.21.6，服务端完成启动，SSH 隧道存在。
- 若模型擅自执行高权限动作：停止服务器、保存脱敏日志、检查 blocked_actions 后再继续。

## 7. 验收
按 [验收矩阵](ACCEPTANCE.md) 逐项填写。不要用 docker compose config 通过替代实机运行通过。