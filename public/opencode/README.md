# OpenCode: token-frugal config + context-management plugins

A small, self-contained bundle for running [OpenCode](https://opencode.ai) against
**Qwen** and **Ornith 1.0** through OpenAI-compatible APIs, with a **live daily
token counter** (Brussels time) and smart context management so an agent loop
can't quietly burn a billion input tokens without you noticing.

Background and the debugging story behind these defaults:
<https://vanmarkic.github.io/mycelium-blog/posts/2026-07-01-opencode-vllm-token-hygiene-en>

## What's in here

| File | Where it goes | What it does |
|------|---------------|--------------|
| `opencode.json` | `~/.config/opencode/` (or project root) | Qwen + Ornith providers, explicit `limit.context` (the key fix), auto-compaction + pruning, a cheap `small_model` for side calls. |
| `plugins/daily-usage.js` | `~/.config/opencode/plugins/` | **Continuously displays** today's total token usage (Brussels time) after each response. Display only — never blocks. Also on npm as `opencode-daily-usage`. |
| `plugins/context-guard.js` | `~/.config/opencode/plugins/` | Truncates oversized tool output (grep/bash/read/…); nudges ranged reads over whole-file reads. |
| `plugins/session-hygiene.js` | `~/.config/opencode/plugins/` | Nudges `/new` once a session gets long/expensive ("one task, one session"). |
| `AGENTS.md` | project root | Lean template — a reminder that this file is re-sent every turn. |
| `install.sh` | — | Fetches all of the above into the right directories. |

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
curl -fsSL $BASE/plugins/daily-usage.js        -o ~/.config/opencode/plugins/daily-usage.js
curl -fsSL $BASE/plugins/context-guard.js      -o ~/.config/opencode/plugins/context-guard.js
curl -fsSL $BASE/plugins/session-hygiene.js    -o ~/.config/opencode/plugins/session-hygiene.js
```

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

## Daily usage display

`daily-usage.js` shows a toast after every response with today's running total,
e.g. `Today 2026-07-01: 12.3M tokens (in 12.0M · out 0.3M) · 31% of 40M · 14:23 CEST`.
It **only displays — it never blocks a request.** "Today" is a calendar day in
Brussels time by default. Environment variables (all optional):

| Variable | Default | Meaning |
|----------|---------|---------|
| `OPENCODE_USAGE_TZ` | `Europe/Brussels` | IANA timezone for the day boundary and clock. |
| `OPENCODE_DAILY_TOKEN_TARGET` | `40000000` | Informational reference shown as `X% of TARGET`. `0` hides it. Never blocks. |
| `OPENCODE_USAGE_TOAST` | _(on)_ | `0` disables the toast (logs still emitted). |
| `OPENCODE_USAGE_COUNT_CACHE` | _(unset)_ | `1` to also count cache read/write tokens. |
| `OPENCODE_USAGE_FILE` | `$XDG_DATA_HOME/opencode/daily-usage.json` | State file location. |

The running total is persisted (with a rolling 30-day history) and rolls over at
midnight Brussels time. Check it any time — the npm package also ships a CLI:

```bash
cat "${XDG_DATA_HOME:-$HOME/.local/share}/opencode/daily-usage.json"
npx opencode-daily-usage          # formatted: today + recent days
```

Prefer an off-the-shelf tool? `opencode-token-tracker` (npm) shows a per-response
toast too, but it's oriented around USD cost + warn thresholds and uses system-local
time, not a configurable timezone.

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
opencode run --print-logs "hi" 2>&1 | grep -Ei "daily-usage|context-guard|session-hygiene"
```

## Notes & caveats

- **Tuning `limit.context` is the real fix.** The plugins are a safety net; the
  structural saving comes from the low, explicit `limit.context` in `opencode.json`,
  which makes compaction fire early instead of near the model's advertised max.
- The daily total counts tokens OpenCode reports on finished assistant messages
  (`event.properties.info.tokens`). If a provider under-reports usage on streamed
  responses, the count is a lower bound.
- `daily-usage.js` is display-only — it never blocks a request. If you want a hard
  ceiling instead, that's a different tool; this one is deliberately non-blocking.
- Plugins are wrapped in try/catch so a plugin error can't wedge your session.

Requires a recent OpenCode (plugin API + `compaction` config). MIT-licensed like the rest of the blog.
