---
title: >-
  A live daily token counter for OpenCode (Brussels time): config + context
  plugins
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
  A ready-to-install OpenCode bundle — config plus three plugins — that shows a
  live daily token total (Brussels time), trims verbose tool output, and nudges
  session hygiene. Wired for Qwen and Ornith 1.0 through OpenAI-compatible APIs.
---

> This is the follow-up to [OpenCode + vLLM: hunting down a billion input tokens](/mycelium-blog/posts/2026-07-01-opencode-vllm-token-hygiene-en). That post was the diagnosis. This one is the fix, packaged so you can install it in one command.

The debugging session behind the last post ended with a clear root cause: with no explicit `limit.context`, OpenCode fell back to the model's advertised context (128k–256k), so compaction fired *late* and every turn re-sent an enormous, uncached prompt. A month of that was **1 billion input tokens**. The single worst two-hour window burned **40 million**.

So I turned the lessons into something reusable: a config that sets the right defaults, and three small plugins that reinforce them. Everything below is downloadable from this site and MIT-licensed. The usage-display plugin is also packaged as an npm module, `opencode-daily-usage`, if you'd rather add it to your `plugin` array than drop in a file.

## Install

```bash
curl -fsSL https://vanmarkic.github.io/mycelium-blog/opencode/install.sh | bash
```

That drops a config into `~/.config/opencode/` and three plugins into `~/.config/opencode/plugins/`. Prefer a project-local install? Add `-s -- --project`. Full manual steps and every knob are in the [README](/mycelium-blog/opencode/README.md).

Individual files:

- [`opencode.json`](/mycelium-blog/opencode/opencode.json) — providers + context limits
- [`plugins/daily-usage.js`](/mycelium-blog/opencode/plugins/daily-usage.js) — live daily token total (Brussels time)
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

### `daily-usage.js` — a live daily total, in Brussels time

I went back and forth on whether this should be a hard cap. It shouldn't: a coding agent that dies mid-task because it hit a number is worse than one that just tells you where you stand. So this plugin **only displays — it never blocks.** After every response it toasts today's running total:

```
Today 2026-07-01: 12.3M tokens (in 12.0M · out 0.3M) · 31% of 40M · 14:23 CEST
```

It reads the token counts OpenCode records on each finished assistant message (`event.properties.info.tokens` → `input`, `output`, `reasoning`), sums them into a per-day total persisted at `~/.local/share/opencode/daily-usage.json` (with a rolling 30-day history), and rolls over at **midnight Brussels time** (`Europe/Brussels`, CET/CEST-aware). Totals accumulate across all sessions and both models.

The `31% of 40M` is a purely informational reference — your rough daily figure — not a limit. Everything is configurable:

```bash
export OPENCODE_USAGE_TZ=Europe/Brussels        # any IANA timezone
export OPENCODE_DAILY_TOKEN_TARGET=40000000     # the "X% of" reference; 0 hides it
# export OPENCODE_USAGE_TOAST=0                   # logs only, no toast
```

It's also on npm as `opencode-daily-usage` (add it to your `plugin` array instead of dropping in the file), and that package ships a `opencode-daily-usage` CLI to print today plus recent days. If you'd rather use something off-the-shelf, [`opencode-token-tracker`](https://github.com/tongsh6/opencode-token-tracker) does a similar per-response toast, though it's built around USD cost and warn-thresholds and uses system-local time rather than a configurable timezone.

Check the live total outside a session any time:

```bash
cat "${XDG_DATA_HOME:-$HOME/.local/share}/opencode/daily-usage.json"
npx opencode-daily-usage   # formatted: today + recent days
```

### `context-guard.js` — stop feeding the context

The cheapest token is the one you never put in context. This plugin caps read-like tool output (`grep`, `bash`, `read`, `glob`, `list`, `webfetch`) to ~20k chars, replacing the overflow with a truncation marker, so a stray whole-repo grep can't drag tens of thousands of tokens into *every* subsequent request. It also nudges toward ranged reads when a whole large file is read without an `offset`/`limit` (set `OPENCODE_BLOCK_FULL_READS=1` to make that a hard stop).

### `session-hygiene.js` — one task, one session

The highest-value habit is starting fresh per task. This plugin tracks each session's turn count and cumulative input tokens and nudges you to run `/new` once it crosses a threshold (default 50 turns or 5M input tokens). It never blocks — it just reminds you before the quadratic cost curve bites.

## Honest caveats

- The plugins are a **safety net**. The structural saving is the low, explicit `limit.context`. If you install nothing else, set that.
- The daily total counts what OpenCode reports on finished messages; if a provider under-reports usage on streamed responses, the total is a lower bound.
- Nothing here blocks by design. `daily-usage.js` shows you the number; what you do about it is yours. If you ever *do* want a hard ceiling, that's a deliberately different tool.

That's the whole kit. It won't make an agent loop cheap — but it means you always know, in Brussels time, exactly how much you've spent today.
