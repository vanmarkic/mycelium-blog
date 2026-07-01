---
title: 'Token-frugal OpenCode: config, context plugins, and usage tracking'
date: '2026-07-01'
status: published
privacy: public
lang: en
tags:
  - opencode
  - llm
  - tokens
  - context-management
  - token-usage
  - plugins
  - qwen
  - ornith
  - agentic-development
  - cost-optimization
repos: []
skills: []
patterns: []
relatedTo:
  - 2026-07-01-opencode-vllm-token-hygiene-en
description: >-
  A ready-to-install OpenCode bundle — config plus plugins — that tracks token
  usage without blocking, trims verbose tool output, and nudges session hygiene.
  Wired for Qwen and Ornith 1.0 through OpenAI-compatible APIs.
---

> This is the follow-up to [OpenCode + vLLM: hunting down a billion input tokens](/mycelium-blog/posts/2026-07-01-opencode-vllm-token-hygiene-en). That post was the diagnosis. This one is the fix, packaged so you can install it in one command.

The debugging session behind the last post ended with a clear root cause: with no explicit `limit.context`, OpenCode fell back to the model's advertised context (128k–256k), so compaction fired *late* and every turn re-sent an enormous, uncached prompt. A month of that was **1 billion input tokens**. The single worst two-hour window burned **40 million**.

So I turned the lessons into something reusable: a config that sets the right defaults, two small local plugins that reinforce them, and an existing npm plugin for usage tracking. Everything downloadable below is on this site and MIT-licensed.

## Install

```bash
curl -fsSL https://vanmarkic.github.io/mycelium-blog/opencode/install.sh | bash
```

That drops the config and two local plugins into `~/.config/opencode/`; the usage tracker is an npm plugin the config pulls in automatically. Prefer a project-local install? Add `-s -- --project`. Full manual steps and every knob are in the [README](/mycelium-blog/opencode/README.md).

Individual files:

- [`opencode.json`](/mycelium-blog/opencode/opencode.json) — providers + context limits + usage-tracker plugin
- [`plugins/context-guard.js`](/mycelium-blog/opencode/plugins/context-guard.js) — output trimming + read discipline
- [`plugins/session-hygiene.js`](/mycelium-blog/opencode/plugins/session-hygiene.js) — one-task-one-session nudges
- [`AGENTS.md`](/mycelium-blog/opencode/AGENTS.md) — a lean template
- [`install.sh`](/mycelium-blog/opencode/install.sh)

## Two models, both through OpenAI-compatible APIs

The config ships two providers, both via `@ai-sdk/openai-compatible`:

- **Qwen** through Alibaba Cloud Model Studio (DashScope). The OpenAI-compatible base URL is `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` (swap for the mainland endpoint, OpenRouter, or your own gateway). Models: `qwen3-coder-plus`, `qwen3-coder-480b-a35b-instruct`.
- **Ornith 1.0** — DeepReinforce AI's open-weight agentic-coding family (9B / 31B / 35B-MoE / 397B-MoE, MIT). There's no hosted API, so you self-host it with vLLM / SGLang / Ollama / LM Studio and point `baseURL` at that endpoint:

  ```bash
  vllm serve deepreinforce-ai/Ornith-1.0-35B \
    --enable-auto-tool-choice --tool-call-parser hermes \
    --max-model-len 32768 --enable-prefix-caching
  ```

API keys never touch the file — the config references `{env:DASHSCOPE_API_KEY}`, `{env:ORNITH_BASE_URL}`, and `{env:ORNITH_API_KEY}`.

### The one setting that matters most

```jsonc
"limit": { "context": 32768, "output": 8192 }
```

OpenCode compacts at roughly `(context − output) × 0.9`. With a 32k context that's ~21.6k tokens — so compaction fires *early* and the average prompt size (the `C` in `cost ≈ C × turns`) stays small, instead of hovering near a 256k ceiling. The config also routes cheap side calls (titles, summaries, compaction) to a small `small_model`, and turns on `compaction` with `prune` so stale tool output gets dropped continuously rather than in one late, expensive pass.

## The plugins

Usage tracking is an off-the-shelf npm plugin; the other two are plain ESM that auto-load from the `plugins/` directory (plural — the singular `plugin/` silently fails) and are wrapped in try/catch so a plugin bug can never wedge your session.

### Usage tracking: `opencode-token-tracker`

I first wrote a custom plugin for this — a non-blocking, Brussels-time daily token counter. But there's already a maintained npm plugin covering the same ground, [`opencode-token-tracker`](https://github.com/tongsh6/opencode-token-tracker), so the config just enables that rather than shipping one more thing to keep alive:

```jsonc
{ "plugin": ["opencode-token-tracker"] }
```

OpenCode installs it automatically at startup. It's **non-blocking by design** — its own words: "budgets are warnings, not enforcement; it does not block API calls, throttle requests, or interrupt active sessions." After each response it toasts that response's usage and the running **session** total:

```
12.5K tokens $0.023 | Session: $0.156
```

For the **daily** figure it ships a CLI:

```bash
opencode-tokens today          # today's total
opencode-tokens --by daily     # day-by-day breakdown
```

Two honest gaps against the original "daily total, in Brussels time" goal, worth knowing going in:

- The **live toast shows the session total, not the running daily total.** The daily number is a CLI call (`opencode-tokens today`), or a `Daily: $x/$y` status toast if you set a `budget.daily`.
- Day boundaries follow your **machine's local time**; there's no timezone setting. If your system clock is `Europe/Brussels` (mine is), the rollover already lands on Brussels midnight — otherwise set it with `timedatectl set-timezone Europe/Brussels`.

Budgets in `~/.config/opencode/token-tracker.json` are in USD with a `warnAt` threshold and only ever warn. If you think in tokens rather than dollars, ignore the budget entirely and just read `opencode-tokens today`.

### `context-guard.js` — stop feeding the context

The cheapest token is the one you never put in context. This plugin caps read-like tool output (`grep`, `bash`, `read`, `glob`, `list`, `webfetch`) to ~20k chars, replacing the overflow with a truncation marker, so a stray whole-repo grep can't drag tens of thousands of tokens into *every* subsequent request. It also nudges toward ranged reads when a whole large file is read without an `offset`/`limit` (set `OPENCODE_BLOCK_FULL_READS=1` to make that a hard stop).

### `session-hygiene.js` — one task, one session

The highest-value habit is starting fresh per task. This plugin tracks each session's turn count and cumulative input tokens and nudges you to run `/new` once it crosses a threshold (default 50 turns or 5M input tokens). It never blocks — it just reminds you before the quadratic cost curve bites.

## Honest caveats

- The plugins are a **safety net**. The structural saving is the low, explicit `limit.context`. If you install nothing else, set that.
- Nothing here blocks by design. `opencode-token-tracker` shows you the number; what you do about it is yours. If you ever *do* want a hard ceiling, that's a deliberately different tool.
- The two local plugins are wrapped in try/catch so a plugin error can't wedge your session.

That's the whole kit. It won't make an agent loop cheap — but it means you always know how much you've spent today, without an agent dying mid-task because it hit a number.
