# opencode-daily-usage

An [OpenCode](https://opencode.ai) plugin that **continuously displays your total
token usage for the day** — a toast after every response showing today's running
total, accumulated across all sessions and models. **Display only: it never blocks
a request.** The day boundary is computed in **Brussels time** by default
(`Europe/Brussels`, CET/CEST-aware) and is configurable to any IANA timezone.

## Install

As an npm plugin (added to your OpenCode config):

```jsonc
// ~/.config/opencode/opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-daily-usage"]
}
```

Or drop the single file into your plugins directory (no config entry needed):

```bash
mkdir -p ~/.config/opencode/plugins
curl -fsSL https://vanmarkic.github.io/mycelium-blog/opencode/plugins/daily-usage.js \
  -o ~/.config/opencode/plugins/daily-usage.js
```

## What you see

After each assistant response, a toast (and a log line):

```
Today 2026-07-01: 12.3M tokens (in 12.0M · out 0.3M) · 31% of 40M · 14:23 CEST
```

The `% of 40M` is a purely informational reference (your rough daily figure); it
is display-only and never limits anything. Set `OPENCODE_DAILY_TOKEN_TARGET=0` to hide it.

## CLI

The package also ships a small CLI to check totals any time:

```bash
npx opencode-daily-usage         # today + recent days
npx opencode-daily-usage --json  # raw state
```

## Configuration (environment variables)

| Variable | Default | Meaning |
|----------|---------|---------|
| `OPENCODE_USAGE_TZ` | `Europe/Brussels` | IANA timezone for the day boundary and clock. |
| `OPENCODE_DAILY_TOKEN_TARGET` | `40000000` | Informational reference shown as `X% of TARGET`. `0` hides it. Never blocks. |
| `OPENCODE_USAGE_TOAST` | _(on)_ | `0` disables the toast (logs still emitted). |
| `OPENCODE_USAGE_COUNT_CACHE` | _(off)_ | `1` to also count cache read/write tokens. |
| `OPENCODE_USAGE_FILE` | `$XDG_DATA_HOME/opencode/daily-usage.json` | State file location. |

## How it works

It reads the token counts OpenCode records on each finished assistant message
(`event.properties.info.tokens` → `input`, `output`, `reasoning`), sums them into
a per-day total, and persists a JSON state file with a rolling 30-day history.
Totals accumulate across concurrent sessions (the file is the source of truth).

If a provider under-reports usage on streamed responses, the displayed total is a
lower bound. The plugin is wrapped in try/catch so it can never wedge a session.

## Related

- Background & the full context-management bundle:
  <https://vanmarkic.github.io/mycelium-blog/posts/2026-07-01-opencode-context-plugins-en>
- Alternatives on npm: `opencode-token-tracker` (cost/USD budgets + toast),
  `tokscale` and `opencode-usage` (external CLI/dashboards).

## License

MIT
