---
title: 'A 40M/day token budget for OpenCode: downloadable config + context plugins'
date: '2026-07-01'
status: published
privacy: public
lang: en
tags:
  - opencode
  - llm
  - tokens
  - context-management
  - token-budget
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
  A ready-to-install OpenCode bundle — config plus three plugins — that caps
  usage at 40 million tokens per day, trims verbose tool output, and nudges
  session hygiene. Wired for Qwen and Ornith 1.0 through OpenAI-compatible APIs.
---

> This is the follow-up to [OpenCode + vLLM: hunting down a billion input tokens](/mycelium-blog/posts/2026-07-01-opencode-vllm-token-hygiene-en). That post was the diagnosis. This one is the fix, packaged so you can install it in one command.

The debugging session behind the last post ended with a clear root cause: with no explicit `limit.context`, OpenCode fell back to the model's advertised context (128k–256k), so compaction fired *late* and every turn re-sent an enormous, uncached prompt. A month of that was **1 billion input tokens**. The single worst two-hour window burned **40 million**.

So I turned the lessons into something reusable: a config that sets the right defaults, and three small plugins that enforce them. Everything below is downloadable from this site and MIT-licensed.

## Install

```bash
curl -fsSL https://vanmarkic.github.io/mycelium-blog/opencode/install.sh | bash
```

That drops a config into `~/.config/opencode/` and three plugins into `~/.config/opencode/plugins/`. Prefer a project-local install? Add `-s -- --project`. Full manual steps and every knob are in the [README](/mycelium-blog/opencode/README.md).

Individual files:

- [`opencode.json`](/mycelium-blog/opencode/opencode.json) — providers + context limits
- [`plugins/token-budget.js`](/mycelium-blog/opencode/plugins/token-budget.js) — the 40M/day cap
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

All three are plain ESM, auto-load from the `plugins/` directory (plural — the singular `plugin/` silently fails), and are wrapped in try/catch so a plugin bug can never wedge your session.

### `token-budget.js` — the hard ceiling

It reads the token counts OpenCode records on each finished assistant message (`event.properties.info.tokens` → `input`, `output`, `reasoning`), sums them into a per-day total persisted at `~/.local/share/opencode/token-budget.json`, and:

- **warns** at 50 / 75 / 90% of the budget,
- **blocks** further model calls at 100% (in the default `block` mode) by throwing in the `chat.params` hook,
- resets at local midnight, across all sessions and both models.

```bash
export OPENCODE_DAILY_TOKEN_BUDGET=40000000   # the default
export OPENCODE_BUDGET_MODE=block             # or "warn"
# export OPENCODE_BUDGET_WINDOW=08:00-18:00    # only track/enforce during work hours
```

Check the live total any time:

```bash
cat "${XDG_DATA_HOME:-$HOME/.local/share}/opencode/token-budget.json"
```

### `context-guard.js` — stop feeding the context

The cheapest token is the one you never put in context. This plugin caps read-like tool output (`grep`, `bash`, `read`, `glob`, `list`, `webfetch`) to ~20k chars, replacing the overflow with a truncation marker, so a stray whole-repo grep can't drag tens of thousands of tokens into *every* subsequent request. It also nudges toward ranged reads when a whole large file is read without an `offset`/`limit` (set `OPENCODE_BLOCK_FULL_READS=1` to make that a hard stop).

### `session-hygiene.js` — one task, one session

The highest-value habit is starting fresh per task. This plugin tracks each session's turn count and cumulative input tokens and nudges you to run `/new` once it crosses a threshold (default 50 turns or 5M input tokens). It never blocks — it just reminds you before the quadratic cost curve bites.

## Honest caveats

- The plugins are a **safety net**. The structural saving is the low, explicit `limit.context`. If you install nothing else, set that.
- The budget counts what OpenCode reports on finished messages; if a provider under-reports usage on streamed responses, the total is a lower bound.
- The `block` guard fires in `chat.params`; how the abort surfaces can vary by OpenCode version. Test with a small `OPENCODE_DAILY_TOKEN_BUDGET` first to see the behavior in your setup.

That's the whole kit. It won't make an agent loop cheap — but it makes "I burned 40M before lunch" impossible to do by accident.
