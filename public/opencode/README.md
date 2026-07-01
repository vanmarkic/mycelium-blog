# OpenCode: token-frugal config + context-management plugins

A small, self-contained bundle for running [OpenCode](https://opencode.ai) against
**Qwen** and **Ornith 1.0** through OpenAI-compatible APIs, with a hard **40M-token
daily budget** and smart context management so an agent loop can't quietly burn a
billion input tokens.

Background and the debugging story behind these defaults:
<https://vanmarkic.github.io/mycelium-blog/posts/2026-07-01-opencode-vllm-token-hygiene-en>

## What's in here

| File | Where it goes | What it does |
|------|---------------|--------------|
| `opencode.json` | `~/.config/opencode/` (or project root) | Qwen + Ornith providers, explicit `limit.context` (the key fix), auto-compaction + pruning, a cheap `small_model` for side calls. |
| `plugins/token-budget.js` | `~/.config/opencode/plugins/` | Tracks tokens/day across all sessions; warns at 50/75/90%; **blocks** model calls at the cap (default 40M). |
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
curl -fsSL $BASE/plugins/token-budget.js       -o ~/.config/opencode/plugins/token-budget.js
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

## The token budget

Environment variables (all optional):

| Variable | Default | Meaning |
|----------|---------|---------|
| `OPENCODE_DAILY_TOKEN_BUDGET` | `40000000` | Daily cap (input + output + reasoning). |
| `OPENCODE_BUDGET_MODE` | `block` | `block` refuses calls at the cap; `warn` only logs/toasts. |
| `OPENCODE_BUDGET_WINDOW` | _(unset)_ | `HH:MM-HH:MM` local time; only track/enforce inside this window. |
| `OPENCODE_BUDGET_COUNT_CACHE` | _(unset)_ | `1` to also count cache read/write tokens. |
| `OPENCODE_BUDGET_FILE` | `$XDG_DATA_HOME/opencode/token-budget.json` | State file location. |

The running total is written to the state file and resets at local midnight (or on
first use inside a new day). Inspect it any time:

```bash
cat "${XDG_DATA_HOME:-$HOME/.local/share}/opencode/token-budget.json"
```

When the cap is reached in `block` mode, the next model call fails with a
`[token-budget] Daily token budget exhausted …` error in the session. Raise the
budget or switch to `warn` mode to continue.

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
opencode run --print-logs "hi" 2>&1 | grep -Ei "token-budget|context-guard|session-hygiene"
```

## Notes & caveats

- **Tuning `limit.context` is the real fix.** The plugins are a safety net; the
  structural saving comes from the low, explicit `limit.context` in `opencode.json`,
  which makes compaction fire early instead of near the model's advertised max.
- The budget counts tokens OpenCode reports on finished assistant messages
  (`event.properties.info.tokens`). If a provider under-reports usage on streamed
  responses, the count is a lower bound.
- The `block` guard runs in the `chat.params` hook; the exact way the abort surfaces
  can vary by OpenCode version. Test with a low `OPENCODE_DAILY_TOKEN_BUDGET` first.
- Plugins are wrapped in try/catch so a plugin error can't wedge your session.

Requires a recent OpenCode (plugin API + `compaction` config). MIT-licensed like the rest of the blog.
