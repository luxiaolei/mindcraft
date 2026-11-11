# AI English Co-Player local PoC

This is an **experimental fork-specific overlay** on Mindcraft, not a finished realtime voice or children’s education product. Use the original MIT LICENSE and upstream docs. Run only with a legally licensed Minecraft Java client, in a trusted local environment.

## Included now
- Isolated Docker Compose definition for a locally bound Paper 1.21.6 server and a Mindcraft bot, with EULA opt-in required.
- English Buddy profile that favors short English prompts, child agency, factual world observations, and stop requests.
- A small, dependency-free learning evidence prototype, tests, and delivery/acceptance documentation.
- Risk constraints: offline-mode only on loopback; no insecure coding, attack, or gamemode commands.

## Not included yet
Live game+model integration has **not** been tested on MBP; Docker daemon is off. Full-duplex audio, external voice gateway, Paper event collector, learner accounts, and cross-session persistence remain planned.

## Dev setup
From repo root, inspect [MBP runbook](../docs/MBP_RUNBOOK.md):

    cp .env.poc.example .env.poc
    cp keys.example.json keys.json
    # Read Minecraft EULA before setting MINECRAFT_EULA=TRUE
    docker compose --env-file .env.poc -f poc/compose.yaml config
    docker compose --env-file .env.poc -f poc/compose.yaml up --build -d

The server only listens on 127.0.0.1:25565 on MBP; do not expose this offline-mode server to the public network. Bot management web port: 127.0.0.1:8080. The child plays in Minecraft Java, not Docker. All secrets and player data stay out of git.

## Offline learning core (not linked to live bot yet)

    node --test poc/tests/*.test.mjs
    node poc/demo.mjs

See [PRD](../docs/PRD_ENGLISH_COPLAYER.md), [Architecture](../docs/ARCHITECTURE.md), [Roadmap](../docs/DELIVERY_PLAN.md), [Acceptance](../docs/ACCEPTANCE.md).