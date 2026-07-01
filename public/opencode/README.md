# OpenCode: token-frugal config + context-management plugins

A small, self-contained bundle for running [OpenCode](https://opencode.ai) against
**Qwen** and **Ornith 1.0** through OpenAI-compatible APIs, with **non-blocking
usage tracking** (via `opencode-token-tracker`) and smart context management so an
agent loop can't quietly burn a billion input tokens without you noticing.

Background and the debugging story behind these defaults:
<https://vanmarkic.github.io/mycelium-blog/posts/2026-07-01-opencode-vllm-token-hygiene-en>

## What's in here

| File | Where it goes | What it does |
|------|---------------|--------------|
| `opencode.json` | `~/.config/opencode/` (or project root) | Qwen + Ornith providers, explicit `limit.context` (the key fix), auto-compaction + pruning, a cheap `small_model`, and `"plugin": ["opencode-token-tracker"]` for usage tracking. |
| `opencode-token-tracker` (npm) | referenced in the config's `plugin` array | Non-blocking token/cost tracker. Per-response + session toast; daily view via `opencode-tokens today`. OpenCode auto-installs it at startup. |
| `plugins/context-guard.js` | `~/.config/opencode/plugins/` | Truncates oversized tool output (grep/bash/read/…); nudges ranged reads over whole-file reads. |
| `plugins/session-hygiene.js` | `~/.config/opencode/plugins/` | Nudges `/new` once a session gets long/expensive ("one task, one session"). |
| `AGENTS.md` | project root | Lean template — a reminder that this file is re-sent every turn. |
| `install.sh` | — | Fetches the config + local plugins into the right directories. |

## Quick install

```bash
curl -fsSL https://vanmarkic.github.io/mycelium-blog/opencode/install.sh | bash
# project-local instead of global:
curl -fsSL https://vanmarkic.github.io/mycelium-blog/opencode/install.sh | bash -s -- --project
```

## Manual install

Plugins auto-load from the `plugins/` directory (plural — the singular `plugin/`
is a known trap that silently fails to load). No `plugin` array entry is needed
for local files.

```bash
mkdir -p ~/.config/opencode/plugins
BASE=https://vanmarkic.github.io/mycelium-blog/opencode
curl -fsSL $BASE/opencode.json                 -o ~/.config/opencode/opencode.json
curl -fsSL $BASE/plugins/context-guard.js      -o ~/.config/opencode/plugins/context-guard.js
curl -fsSL $BASE/plugins/session-hygiene.js    -o ~/.config/opencode/plugins/session-hygiene.js
```

`opencode-token-tracker` is not a file — it's the npm entry in the config's
`plugin` array. OpenCode installs it automatically at startup (via Bun).

## Configure your providers

Secrets stay in your environment; the config only references `{env:...}`.

```bash
# Qwen via Alibaba Cloud Model Studio (DashScope), OpenAI-compatible endpoint.
export DASHSCOPE_API_KEY=sk-...
# International endpoint is the default in opencode.json; for mainland China use
# https://dashscope.aliyuncs.com/compatible-mode/v1 (edit the baseURL).

# Ornith 1.0 — no hosted API; run it yourself and point at the endpoint.
#   vllm serve deepreinforce-ai/Ornith-1.0-35B \
#     --enable-auto-tool-choice --tool-call-parser hermes \
#     --max-model-len 32768 --enable-prefix-caching
export ORNITH_BASE_URL=http://localhost:8000/v1
export ORNITH_API_KEY=local   # any non-empty value if your server is unauthenticated
```

Switch models any time with `/models` in the TUI.

## Usage tracking (opencode-token-tracker)

Usage tracking is handled by [`opencode-token-tracker`](https://github.com/tongsh6/opencode-token-tracker),
referenced in the config's `plugin` array. It's **non-blocking** — purely
observational (it never blocks, throttles, or interrupts a session). After each
response it toasts that response's usage plus the running **session** total, e.g.
`12.5K tokens $0.023 | Session: $0.156`.

For the **daily** number, use its CLI:

```bash
opencode-tokens today          # today's total
opencode-tokens --by daily     # day-by-day breakdown
```

Config lives in `~/.config/opencode/token-tracker.json` (manage it with
`opencode-tokens config`):

| Key | Meaning |
|-----|---------|
| `budget.daily` / `budget.weekly` / `budget.monthly` | Budgets **in USD**. Warn-only — never block. |
| `budget.warnAt` | Warn threshold, e.g. `0.8` = 80%. Shows a `Daily: $x/$y` status toast. |
| `toast.enabled` / `toast.duration` / `toast.showOnIdle` | Toast behaviour. |

Two honest limitations for the "daily total in Brussels time" goal:

- The **live toast shows the session total, not the daily total** — read the daily
  figure with `opencode-tokens today`.
- Day boundaries follow your **machine's local time** (there's no timezone option).
  Set your system clock to `Europe/Brussels` if you want a Brussels-midnight rollover
  (`timedatectl set-timezone Europe/Brussels` on Linux).

## Context guard & session hygiene

| Variable | Default | Meaning |
|----------|---------|---------|
| `OPENCODE_MAX_TOOL_OUTPUT_CHARS` | `20000` | Max chars kept per read-like tool result (`0` disables). |
| `OPENCODE_FULL_READ_LINES` | `1500` | File size above which an unranged `read` gets a nudge. |
| `OPENCODE_BLOCK_FULL_READS` | _(unset)_ | `1` to block (not just warn on) large unranged reads. |
| `OPENCODE_HYGIENE_MAX_TURNS` | `50` | Turns before the "start a fresh session" nudge. |
| `OPENCODE_HYGIENE_MAX_INPUT` | `5000000` | Cumulative session input tokens before the nudge. |

## Verify it loaded

```bash
opencode run --print-logs "hi" 2>&1 | grep -Ei "token-tracker|context-guard|session-hygiene"
```

## Notes & caveats

- **Tuning `limit.context` is the real fix.** The plugins are a safety net; the
  structural saving comes from the low, explicit `limit.context` in `opencode.json`,
  which makes compaction fire early instead of near the model's advertised max.
- Usage tracking is display-only — `opencode-token-tracker` never blocks a request.
  If you ever want a hard ceiling, that's a deliberately different tool.
- The two local plugins (`context-guard`, `session-hygiene`) are wrapped in
  try/catch so a plugin error can't wedge your session.

Requires a recent OpenCode (plugin API + `compaction` config). MIT-licensed like the rest of the blog.
