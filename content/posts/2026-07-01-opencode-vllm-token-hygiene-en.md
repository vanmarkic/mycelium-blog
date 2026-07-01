---
title: 'OpenCode + vLLM: thinking, rate limiting, and hunting down a billion input tokens'
date: '2026-07-01'
status: published
privacy: public
lang: en
tags:
  - opencode
  - vllm
  - llm
  - tokens
  - context-management
  - rate-limiting
  - agentic-development
  - cost-optimization
  - devops
repos: []
skills: []
patterns: []
relatedTo: []
description: >-
  A debugging session on OpenCode CLI against a self-hosted vLLM backend:
  configuring thinking and rate limiting, disabling subagents, removing
  Superpowers, tracking token usage locally, and finally tracing 1 billion
  input tokens back to a missing context limit.
---

> This is a real debugging session, published as-is (no translation — it runs from English into French and back). It walks from "how do I set thinking and rate limiting" all the way to the root cause of a runaway token bill: a missing `limit.context` letting compaction fire far too late.

## Setting thinking and rate limiting (with vLLM)

> how to set thinking and rate limiting in opencode cli using vllm

"Thinking" and "rate limiting" cut across two layers here: the vLLM server (which actually produces reasoning tokens and enforces concurrency) and the OpenCode client config (which requests thinking and controls retry/backoff). You configure them in different places.

### Thinking / reasoning

OpenCode has no dedicated `thinking` toggle for OpenAI-compatible providers the way it does for the built-in Anthropic provider. With vLLM the reasoning is driven server-side and surfaced through the chat template. Two-part setup:

**1. vLLM server** — enable a reasoning parser so chain-of-thought is separated from the answer (otherwise it leaks into tool-call arguments and breaks the agent loop):

```
vllm serve <model> \
  --enable-auto-tool-choice \
  --tool-call-parser qwen3_xml \
  --reasoning-parser deepseek_r1 \   # or qwen3, nemotron_v3, etc — match your model
  --max-model-len 32768
```

The `--reasoning-parser` flag specifies the reasoning parser to use for extracting reasoning content from the model output. The correct parser name is model-specific (Qwen3 → `qwen3`, DeepSeek-R1 → `deepseek_r1`, Nemotron → `nemotron_v3`). Get it from the model card.

For Qwen3, the reasoning feature is enabled by default; to disable it you must pass `enable_thinking=False` in `chat_template_kwargs`. To cap reasoning length server-side, vLLM's `--reasoning-config` accepts a `thinking_token_budget`; if it is not specified, no explicit reasoning limit is applied beyond normal constraints such as `max_tokens`.

**2. OpenCode config** — pass thinking flags per model via `options`, which get forwarded to vLLM's `extra_body`. In `~/.config/opencode/opencode.json` (or project `opencode.json`):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "vllm": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "vLLM (local)",
      "options": {
        "baseURL": "http://localhost:8000/v1",
        "apiKey": "{env:VLLM_API_KEY}"
      },
      "models": {
        "Qwen/Qwen3-Coder-30B-A3B-Instruct": {
          "name": "Qwen3 Coder 30B",
          "limit": { "context": 32768, "output": 16384 }
        }
      }
    }
  },
  "model": "vllm/Qwen/Qwen3-Coder-30B-A3B-Instruct"
}
```

Caveat (uncertain): whether OpenCode's `@ai-sdk/openai-compatible` adapter reliably passes arbitrary `chat_template_kwargs` through `options` varies by version. The robust path is to control thinking on the server (parser + budget), not the client. I'd verify against your installed OpenCode version rather than assume the passthrough works.

### Rate limiting

There are two distinct things people mean by this:

**Server-side concurrency** (the real throughput limiter for local vLLM). The more memory allocated for context, the fewer simultaneous requests the GPU can handle — larger context windows reduce how many sessions can run in parallel. Control it with vLLM serve flags: `--max-num-seqs` (max concurrent sequences) and `--max-num-batched-tokens`. To hard-cap accepted requests, put a reverse proxy (nginx `limit_req`, or an API gateway) in front of the `/v1` endpoint. vLLM itself has no built-in per-client rate limiter.

**Client-side output/context budget** (prevents truncation, which masquerades as rate/parser failure). Set `limit.context` and `limit.output` per model as above. Critical for reasoning models: reasoning tokens are generated before the tool call and count against `max_tokens`; a stingy output limit causes `finish_reason: "length"` truncation before the tool call is ever emitted. Give a generous `output`. And set `limit.context` to a value you've verified fits end-to-end with margin, not the theoretical max — OpenCode uses it to decide when to compact, and will otherwise pack prompts the server rejects mid-session.

One thing to flag: for a purely local single-user vLLM setup, client-side "rate limiting" is usually the wrong lever. The binding constraint is GPU memory and `--max-num-seqs`, not request throttling.

## Hitting a hard 20 RPM server cap

> i have a limit of 20 requests per minute set at server side by the platform devops admin

Then you want client-side throttling in OpenCode, since the constraint is upstream and you can't change it.

Short answer: OpenCode has no native client-side request-per-minute throttle. It handles 429s reactively (retry/backoff, and surfaces a "you are rate-limited" warning), not proactively by spacing requests. So you can't tell OpenCode "cap me at 20 RPM" through config.

You have three practical routes:

### 1. Rely on OpenCode's retry/backoff (least effort, imperfect)

OpenCode does detect 429s and back off. The problem: a coding agent fires many calls per "task" (main agent + subagents + tool loops), so 20 RPM is easy to blow past in bursts, and you'll get interrupted mid-task. The known failure mode is that when the model encounters a rate limit, the TUI displays a warning like "You are rate-limited", but this warning doesn't reliably propagate for sub-agents — so with parallel subagents you may not even see why it stalled.

Mitigations that reduce request volume (so you stay under 20 RPM without a throttle):

- Disable or minimise subagents / parallel agents — this is the single biggest RPM multiplier.
- Set a single default `model` and `small_model` to the same endpoint so you don't double up.
- Prefer targeted context over whole-repo dumps (fewer compaction/summary calls).

### 2. Put a rate-limiting proxy in front of the endpoint (robust, recommended)

Since the limit is fixed server-side and you can't change OpenCode's request cadence, insert a local proxy that queues/spaces requests to ≤20 RPM (one request every 3 s), then point OpenCode's `baseURL` at the proxy. This is the standard fix — a client-side queue spaced at least 3 seconds apart keeps you under a 20 RPM cap, and prevents 429s rather than reacting to them.

Options:

- **LiteLLM proxy** — supports `rpm` limits per model/key natively. Config `rpm: 20` on the deployment, point OpenCode at LiteLLM's `/v1`.
- **nginx `limit_req`** zone at `rate=20r/m` with a `burst` and `delay` to smooth rather than reject.
- **A tiny local FastAPI/Node shim** implementing a token-bucket at 20 RPM.

LiteLLM is the cleanest given your stack.

### 3. Check whether your vLLM/gateway returns `Retry-After`

If the platform's 20 RPM limiter emits a `Retry-After` header on its 429, OpenCode's backoff will honour it and behave far better. If it just drops the request or returns a bare 429, backoff is blind and route 2 becomes necessary.

**Recommendation:** route 2 via LiteLLM. It's the only approach that reliably respects a hard 20 RPM server cap without you babysitting the session.

## Disabling subagents / parallel agents

> how to disable subagents parallel agents?

There's no single "disable parallelism" switch. Subagents are invoked through the `task` tool, so the mechanism is: deny the `task` permission on your primary agent. That removes the Task tool from the model's toolset, so it can't spawn any subagent, which is what generates the parallel/bursty request load.

**Cleanest method: deny `task` on your build agent.** In `~/.config/opencode/opencode.json` (global) or project `opencode.json`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "permission": {
        "task": "deny"
      }
    }
  }
}
```

`task` is one of the available permission keys. Subagents are the assistants a primary agent invokes via the Task tool, so denying it stops delegation entirely. Setting it to `"deny"` is stronger than hiding — when a task permission is set to deny, the subagent is removed from the Task tool description entirely, so the model won't attempt to invoke it. Build is the right target because Build is the default primary agent with all tools enabled.

If you want it to apply everywhere regardless of which primary agent is active, set it on both built-in primaries:

```jsonc
{
  "agent": {
    "build": { "permission": { "task": "deny" } },
    "plan":  { "permission": { "task": "deny" } }
  }
}
```

**Alternative: disable individual subagents.** If you'd rather keep delegation but kill specific heavy ones, set `disable: true`. OpenCode ships three built-in subagents — General, Explore, and Scout:

```jsonc
{
  "agent": {
    "general": { "disable": true },
    "explore": { "disable": true },
    "scout":   { "disable": true }
  }
}
```

Caveat: I'm not fully certain the built-in subagent keys are lowercase `general`/`explore`/`scout` versus another casing in the current schema — verify against the docs for your version. The `task: deny` route sidesteps this since it blocks the mechanism rather than named agents.

**Important limitation for the RPM problem:** this stops subagent-driven parallelism. It does not make OpenCode a one-request-at-a-time client — the primary agent still fires tool loops, and system agents (compaction, title generation, summarisation) run automatically. So denying `task` meaningfully cuts your burst rate but won't guarantee ≤20 RPM on its own. For a hard cap you still need the proxy.

## 40M tokens in 2 hours — is it the skills?

> I used 40 million tokens in 2 hours. it seems huge. can it be related to the amount of skills loaded in my project?

Plausibly a contributor, but 40M tokens in 2h is more likely driven by the agent loop itself than by skills alone.

### What skills actually cost

Skill descriptions (the frontmatter/trigger text) get injected into the system prompt so the model knows what's available. That's a fixed per-request tax. If you have many skills, each with a verbose description, that block can reach a few thousand tokens — and critically, it's re-sent on every request in the session. So skills do multiply, but the multiplier is "extra tokens × number of requests," not a one-off.

The skill body (SKILL.md content, referenced files) only loads when a skill is actually triggered. Those can be large, but they're occasional, not per-request.

So: skills inflate your baseline per-call size. Inference: with a lot of skills, maybe 3–8k extra tokens per request. Over a heavy 2h session that's real but unlikely to be the dominant term.

### What actually burns 40M in 2h

The structural cost driver in any coding agent is that the full conversation is re-sent on every step, and it grows monotonically:

- Each tool call (read file, grep, bash, edit) appends its output to the context.
- The next request sends everything so far again.
- A single "task" can be 20–50+ tool loops.
- So token usage grows roughly quadratically with conversation length, not linearly.

Two amplifiers specific to your setup:

- **Subagents** (before you disabled `task`) each spin up their own session with its own full context. Parallel subagents multiply token throughput directly.
- **A large `limit.context`** means compaction fires late, so you carry a bloated context for longer before it summarises.

### How to actually diagnose it

Don't guess — measure. Order of likely impact:

1. Check whether subagents were running during that window. If `task` was still enabled and it spawned General/Explore/Scout in parallel, that alone can 3–4× throughput.
2. Count your skill descriptions. `wc -w` across the frontmatter of all loaded SKILL.md files. If it's >2–3k words total, trim descriptions or disable skills you don't use in this project.
3. Look at what got read into context — large file dumps, whole-repo greps, verbose test/build logs piped back.
4. Check compaction frequency. If `limit.context` is set very high, lower it so it compacts sooner.

Bottom line: skills are a real but secondary cost (per-request baseline inflation). The 40M figure points at conversation-length growth plus, most likely, subagent fan-out during that window.

## « J'ai 621 KB de skills »

> j'ai 621kb de skills

621 KB, c'est la taille sur disque de tes skills — pas ce qui entre dans le contexte. La distinction est le point clé, donc attention à ne pas confondre les deux.

### Ce qui compte vraiment

Seules les descriptions (frontmatter : `name` + `description`) sont injectées à chaque requête. Les corps (SKILL.md complets, fichiers `references/`, `scripts/`) restent sur disque et ne se chargent que si un skill est déclenché.

Donc tes 621 KB se décomposent en :

- une petite fraction = descriptions → coût par requête, répété à chaque appel ;
- le gros = corps → coût ponctuel, seulement quand un skill est invoqué.

### Ordre de grandeur

Inférence, à vérifier : en anglais, ~4 caractères par token. Si les 621 KB étaient tous dans le contexte, ça ferait ~155k tokens. Mais ce n'est pas le cas — seules les descriptions le sont en permanence.

Estimation grossière : si tu as ~15–25 skills avec des descriptions de 100–300 mots chacune, le bloc de descriptions injecté en permanence est de l'ordre de 3–8k tokens par requête. Sur une session de 2h avec, disons, 300–500 requêtes, ça donne ~1,5–4M tokens cumulés rien que pour les descriptions.

C'est réel, mais ça n'explique pas 40M. Au mieux 10 % environ de ton total. Le reste vient de la croissance du contexte (historique complet renvoyé à chaque étape) et, très probablement, du fan-out des subagents pendant cette fenêtre.

### Ce qu'il faut mesurer, pas deviner

Pour isoler la part réelle des descriptions dans le contexte :

```bash
# Total descriptions frontmatter de tous les skills chargés
find .opencode/skills ~/.config/opencode/skills -name "SKILL.md" 2>/dev/null \
  | xargs awk '/^---/{f=!f; next} f' \
  | wc -w
```

Multiplie le nombre de mots par ~1,3 pour approcher les tokens. Si c'est >3–4k mots, tu as un vrai levier : élague les descriptions ou désactive les skills inutiles dans ce projet.

**Verdict :** 621 KB sur disque ≠ 621 KB dans le contexte. Les skills contribuent, mais comme coût de base par requête, pas comme cause dominante. Pour 40M en 2h, mon ordre de suspicion reste : (1) subagents en parallèle (si `task` était encore actif), (2) croissance quadratique de l'historique, (3) descriptions de skills — secondaire.

## Superpowers and the plugin list

> i have superpowers and list plugins installed

Superpowers (obra/superpowers) is almost certainly a major contributor to your 40M, and it explains several things at once. Here's the mechanism, from certain to inferred.

### What Superpowers injects, and where the tokens go

1. **Bootstrap injected into every session** (and after every compaction). The plugin uses a `transform` hook to prepend the `using-superpowers` meta-skill content into your conversation at session start — and again after compaction. The design does try to be economical: it injects into the first user message rather than repeating a system message. But "injected once at start, re-injected after each compact" still means it rides along in the full history that gets re-sent on every subsequent request.
2. **The bootstrap lists all discovered skills.** With Superpowers' own skill library plus your 621 KB of personal/project skills, that discovery listing is large — and it's in context from the start.
3. **Superpowers is a subagent-driven methodology.** Its whole workflow is built on delegation: after design approval it launches a subagent-driven development process, having agents work through each engineering task. On OpenCode, its skills map Task-with-subagents onto OpenCode's @mention / subagent system.

That's the collision with your earlier fix. Superpowers actively wants to spawn subagents. Each subagent gets its own fresh session — its own full context including the re-injected bootstrap and skill listing. Fan-out × per-session bootstrap × re-sent history is exactly the shape that produces 40M in 2h.

### What this means for your levers

Your `task: "deny"` fix and Superpowers conflict directly. If `task` is denied, you're crippling Superpowers' methodology (it can't delegate). If Superpowers is running as intended, it's re-enabling the exact fan-out you tried to stop. Decide which you want:

- **Option A — keep Superpowers, accept the cost.** Don't fight it with `task: deny`. Cap the ceiling with the LiteLLM `rpm: 20` proxy and use short, single-purpose sessions.
- **Option B — cut cost, drop or gate Superpowers.** Remove it from the `plugin` array in `opencode.json` and restart. Verify it's gone:

```bash
opencode run --print-logs "hello" 2>&1 | grep -i superpowers
```

- **Option C — keep it installed but stop the always-on injection.** The bootstrap fires via the plugin's `transform` hook at every session start. Uncertain whether Superpowers exposes a clean "don't auto-bootstrap" flag — you'd likely have to move it from global to project-level config so it only loads where you opt in.

My honest read: with Superpowers installed and a big skill library, you were running the most token-intensive configuration OpenCode supports.

## Removing it from the plugin array

> how to remove from the plugin array?

Superpowers loads from the `plugin` array in `opencode.json`, so you remove that entry and restart.

1. Find which config has it (global or project):

```bash
grep -l superpowers ~/.config/opencode/opencode.json .opencode/opencode.json 2>/dev/null
```

2. Edit that file. Locate the `plugin` array:

```jsonc
{
  "plugin": ["superpowers@git+https://github.com/obra/superpowers.git"]
}
```

Remove the Superpowers string. If it's the only entry, delete the whole `plugin` key. If there are other plugins, keep them and drop only the Superpowers element. Watch the commas — no trailing comma after the last array element, or OpenCode will fail to parse the JSON.

3. Restart OpenCode (fully quit; the plugin loads at startup).

4. Verify it's gone:

```bash
opencode run --print-logs "hello" 2>&1 | grep -i superpowers
```

No output = removed.

**Clean up the leftover install.** Removing the array entry stops it loading, but the cached package and any old symlinks stay on disk:

```bash
rm -f  ~/.config/opencode/plugins/superpowers.js
rm -rf ~/.config/opencode/skills/superpowers
rm -rf ~/.config/opencode/superpowers
```

### « It's not in there »

> it's not in there

Then it's loaded another way. Superpowers has several install paths. Run these:

```bash
# 1. Check the plugins directory for a dropped-in file or symlink
ls -la ~/.config/opencode/plugins/ 2>/dev/null
ls -la .opencode/plugins/ 2>/dev/null

# 2. Check for the cloned repo and skill symlinks
ls -la ~/.config/opencode/superpowers 2>/dev/null
ls -la ~/.config/opencode/skills/ 2>/dev/null

# 3. Check if it was npm-installed into node_modules (the Windows fallback method)
ls -la ~/.config/opencode/node_modules/superpowers 2>/dev/null

# 4. Search every opencode config for any superpowers reference
grep -ri superpowers ~/.config/opencode/ .opencode/ 2>/dev/null

# 5. Confirm it's actually loading and see from where
opencode run --print-logs "hello" 2>&1 | grep -i superpowers
```

If it's not in the `plugin` array it's almost certainly one of: **(A)** old symlink method (`~/.config/opencode/plugins/superpowers.js` + `skills/superpowers`, auto-loaded from the directory); **(B)** npm-installed into `node_modules` (Windows/WSL fallback); **(C)** project-level rather than global; or **(D)** it's not Superpowers at all — just a large personal skills library auto-discovered from the skills directory (skills aren't plugins, so they never appear in a plugin array).

### « The plugins and skills were installed at project level »

> done, the plugins and skills were installed at project level

That pins it. Project-level `.opencode/plugins/` and `.opencode/skills/` in the repo you were working in. That fully explains the 40M.

```bash
# from the project root
rm -rf .opencode/plugins/superpowers.js
rm -rf .opencode/skills/superpowers
# remove any superpowers entry if one exists in the project config
grep -i superpowers .opencode/opencode.json 2>/dev/null
```

Watch for these:

- **Your own skills vs Superpowers' skills.** `.opencode/skills/` may contain both. Only remove the `superpowers/` subdirectory, not the whole `skills/` folder. List first: `ls .opencode/skills/`.
- **Symlinks.** These were often symlinked rather than copied. `rm -rf` on a symlink removes the link, not the target — verify with `ls -la .opencode/plugins/`.

One correction to your earlier config work: now that Superpowers is going, revisit the `task: "deny"` you set. The fan-out was largely Superpowers driving it. With Superpowers gone, you may want subagents back for normal delegation. Dropping Superpowers removes the always-on bootstrap injection (re-fired after every compaction) and the subagent-driven loop — the single biggest reduction available to you.

## Keeping a local record of input/output tokens

> how could i keep locally of my input and output tokens?

### Read what OpenCode already stores

OpenCode persists session data locally, including token counts per message (it needs them to decide when to compact). So the data already exists on disk — you just read it.

```bash
# Common locations — check which exists
ls -la ~/.local/share/opencode/ 2>/dev/null
ls -la ~/.config/opencode/ 2>/dev/null
find ~ -path '*opencode*' -name '*.json' 2>/dev/null | grep -i -E 'session|message|storage' | head

# Once found, look for token/usage fields
grep -ri -l '"tokens"\|"usage"\|inputTokens\|outputTokens' ~/.local/share/opencode/ 2>/dev/null | head
```

If session messages are stored as JSON, each assistant message typically carries a usage block (input, output, and often cache read/write). You can sum them with `jq`:

```bash
# Illustrative — adjust the path and field names to what you actually find
find ~/.local/share/opencode -name '*.json' -path '*message*' \
  | xargs jq -s '[.[].usage // empty]
      | reduce .[] as $u ({in:0,out:0};
          {in: (.in + ($u.inputTokens//0)), out: (.out + ($u.outputTokens//0))})'
```

### Live view: the TUI already shows it

During a session, OpenCode's TUI displays token/cost info (the bottom-of-screen indicators). vLLM's OpenAI-compatible endpoint returns a `usage` object, so it should populate.

### Robust option: log at the proxy

If you run a LiteLLM proxy in front of vLLM (for the `rpm: 20` cap), LiteLLM logs token usage per request natively — the cleanest persistent local record because it's independent of OpenCode's internals and survives version changes:

```yaml
litellm_settings:
  # writes per-request usage (model, input/output tokens, cost) to a local file or DB
  success_callback: ["logfile"]   # or a local SQLite/Postgres via database_url
```

### The vLLM server itself

vLLM exposes Prometheus metrics including prompt and generation token counters at `/metrics`. Heavier to set up (Prometheus + Grafana) but it's the ground truth for the GPU.

## A daily counter, 8am–6pm

> I want a daily counter from 8am to 6pm

A daily counter windowed to your working hours (08:00–18:00) is a log-plus-aggregation job. I asked three clarifying questions first; the answers: a **live running total** checkable anytime during the day, requests going to an **unknown/uncertain** backend (maybe proxied, maybe not), and counting **input and output tokens separately**.

That "not sure about the proxy" is the crux, so here's an approach that works either way: a transparent logging middleware you point OpenCode at, which forwards to whatever backend you already use (proxy or vLLM) and keeps a live running total for the 08:00–18:00 window.

A tiny local proxy sits between OpenCode and your backend. It reads the `usage` block that the OpenAI-compatible endpoint returns (both vLLM and LiteLLM include it), accumulates input/output tokens per day within your work window, and exposes a live total at `http://localhost:4100/stats`.

```bash
pip install fastapi uvicorn httpx --break-system-packages
BACKEND=http://localhost:8000 python token_counter.py
```

Point OpenCode at the counter in `opencode.json`:

```jsonc
"options": { "baseURL": "http://localhost:4100/v1" }
```

Check the live total anytime:

```bash
curl -s http://localhost:4100/stats | python -m json.tool
```

Things to flag honestly:

- **Usage on streaming responses:** vLLM only emits the `usage` block in the final SSE chunk if the request includes `stream_options: {"include_usage": true}`. OpenCode may or may not set this. If streaming token counts come back as zero, that's why.
- **This adds a third hop** (OpenCode → counter → backend). If you already run LiteLLM, its native callback logging is cleaner — but that gives you a log to query, not a live running total out of the box.

## « Search online — I'm connecting to an online service »

> search online for such a tool. i'm connecting to an online service

That changes things — you're hitting a hosted API, not local vLLM. Dedicated tools exist and they're a better fit than the proxy, because they read OpenCode's local session database directly — which works regardless of backend, since OpenCode records usage on its own side. Forget the proxy.

**Best fit: `opencode-usage` (live web dashboard).** Reads OpenCode's SQLite store and aggregates by day. Requires OpenCode v1.2.0+ (SQLite storage), aggregates token usage by day, and estimates cost from current API pricing. Live dashboard:

```bash
bunx opencode-usage --commander        # live dashboard
# or one-shot:
bunx opencode-usage                     # daily breakdown in terminal
```

**Runner-up: `tokscale` (Rust TUI, has hourly view).** Relevant because it has an hourly breakdown — the nearest thing to your work-window need. Interactive views include Overview, Models, Daily, Hourly, Stats, and Agents. Reads `~/.local/share/opencode/opencode.db` (1.2+) or the legacy message storage:

```bash
bunx tokscale@latest --today
```

**If you want budget alerts too: `opencode-token-tracker`.** Plugin that pushes a live toast after each response and tracks input/output. Supports daily/weekly/monthly budgets with a `warnAt` threshold, plus `opencode-tokens today`.

**The 08:00–18:00 gap — honest assessment.** None of these filter to a fixed daily hour window natively. Three ways to bridge it: (1) accept day-level and glance at the hourly view — if you only ever work 08:00–18:00, the daily total *is* your work-window total; (2) query the SQLite DB directly with a time filter (`~/.local/share/opencode/opencode.db`), summing input/output where the message timestamp falls in 08–18 local; (3) the proxy from before — now clearly the wrong tool.

## opencode-usage doesn't show last month

> opencode usage doesn't show previous month

Two separate possible causes.

**Cause 1: You're using the tool's default view (most likely).** `opencode-usage` defaults to a recent window. It supports explicit date ranges and monthly aggregation:

```bash
# Previous month explicitly
opencode-usage --since 2026-06-01 --until 2026-06-30

# Monthly aggregation across all data
opencode-usage --monthly

# Live watch, refreshes every 5s
opencode-usage --watch
```

**Cause 2: The data genuinely isn't there.** Two known OpenCode bugs cause this:

- **Database file renamed on update.** A recent update switched the DB from `opencode.db` to `opencode-prod.db` without migrating, so the new version reads an empty DB and prior history vanishes — while old data sits intact in the original file. Check `ls -la ~/.local/share/opencode/*.db`; if you see both, merge the old DB into the new one (`sqlite3 ATTACH ... INSERT OR IGNORE`, back up first).
- **Sessions present in DB but not shown** due to a session-ID validation error (`"dummy"` vs `ses_*`). Same symptom, recoverable.

**Alternative tool that reads raw files:** `ccusage` reads OpenCode's JSON session files directly rather than the SQLite DB, so it can see history the DB-based tool misses. Note: OpenCode support is experimental, and OpenCode stores `cost: 0` in message files, so ccusage computes cost from token counts (token counts themselves are read directly and unaffected).

## Routing to a local LM Studio for testing

> can I route opencode to local lmstudio for testing purposes?

Yes. LM Studio exposes an OpenAI-compatible server, so it slots into OpenCode the same way vLLM does.

**1. Start LM Studio's server** (Developer tab → Start Server, or `lms server start`). Default endpoint `http://localhost:1234/v1`. Verify the exact model ID:

```bash
curl http://localhost:1234/v1/models
```

**2. Add the provider to `opencode.json`:**

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": {
        "baseURL": "http://localhost:1234/v1",
        "apiKey": "lm-studio"
      },
      "models": {
        "qwen2.5-coder-7b-instruct": {
          "name": "Qwen2.5 Coder 7B (LM Studio)"
        }
      }
    }
  },
  "model": "lmstudio/qwen2.5-coder-7b-instruct"
}
```

Notes: replace the model key with the exact `id` from `/v1/models`; `apiKey` is required by the adapter but LM Studio ignores its value; the `model` field is `provider/model-id`.

**3. Optional context limits** — match whatever context length you loaded the model with in LM Studio (often smaller than the model's theoretical max):

```jsonc
"models": {
  "qwen2.5-coder-7b-instruct": {
    "name": "Qwen2.5 Coder 7B (LM Studio)",
    "limit": { "context": 8192, "output": 4096 }
  }
}
```

**Flag for a testing setup:** tool-calling support is the main risk. OpenCode is agentic and depends heavily on function/tool calling. Smaller models often produce malformed tool calls that break the agent loop. If OpenCode behaves erratically (ignores tools, loops, emits tool JSON as text), this is usually why — not the routing.

## The real number: 1 billion input, 2 million output

> since june 2nd till july 1st i have 1 billion input and 2 million output. skills and plugins were installed on june 24th, I don't see dramatic changes after that date

That ratio is the real signal, and it points away from skills/plugins entirely.

### The input/output ratio is the tell

1 billion input : 2 million output is a **500:1 ratio**. That is extreme. Normal coding-agent work runs maybe 5:1 to 50:1. 500:1 means you are re-sending enormous context on almost every call while generating very little each time.

That pattern is diagnostic: it's **context re-transmission, not generation**. Every request drags a massive prompt; the model replies briefly; next request drags the massive prompt again plus the new bit.

### Your June 24th observation is decisive

You installed skills and plugins on June 24th and saw no dramatic change. Take that at face value — it's strong evidence. If Superpowers/skills were the driver, you'd see a step-change at the 24th. You don't. **Skills and plugins are largely exonerated.** My earlier ranking put Superpowers' subagent fan-out as the lead suspect — your data contradicts that, and your data wins. This also means the `task: deny` and plugin-removal work, while not harmful, wasn't addressing the actual cost.

### What produces a 500:1 input ratio

Large context sent repeatedly across many requests. Candidates, in order of likelihood:

1. **Huge per-request context that never shrinks.** A very high `limit.context` means compaction rarely fires. My lead suspect now.
2. **Cache not being used / not effective.** With an online provider, repeated context is normally offset by prompt caching. Your "1 billion input" may be conflating cache reads with fresh input — worth checking whether your billing separates cache-read tokens.
3. **Very long-running sessions.** Never starting fresh means context grows monotonically for hours.
4. **Large files / verbose tool output** pulled into context and carried forward on every step.

## « Cache 0 reads, 0 writes, ever »

> cache 0 reads 0 writes, ever

That changes the diagnosis completely — and it means you have a real, fixable, expensive problem, not a measurement artefact.

Every one of those input tokens was billed as fresh input. No caching offset at all. So the 1 billion is genuine full-price prompt processing, re-sent in its entirety on every single request. The 500:1 ratio is exactly what it looks like.

Prompt caching on a coding agent typically cuts input cost by 80–90% because the bulk of each request (system prompt, tools, file context, history) is identical to the previous turn. Cache 0/0 ever means caching is not engaged at all. Likely causes: the provider/endpoint doesn't support prompt caching or OpenCode isn't sending cache-control markers; the `openai-compatible` adapter doesn't emit cache-control the way the native Anthropic provider does; or provider-side caching exists but needs a flag you're not setting.

Which online service is OpenCode pointed at? That single fact determines everything.

### « It's an internal platform, using vLLM »

> it's an internal platform, using vllm

That pins it. vLLM does support prefix caching, but it's a different mechanism than API-provider prompt caching.

**Two different things called "cache":**

- **API prompt caching** (Anthropic/OpenAI-style): the response `usage` block reports `cache_creation_input_tokens` / `cache_read_input_tokens` as distinct fields. This is what your tracking tool is looking for.
- **vLLM automatic prefix caching (APC):** vLLM reuses the KV-cache for shared prompt prefixes, saving prefill compute on the GPU. But a vanilla vLLM `usage` block does **not** populate the OpenAI-style cache token fields — it reports `prompt_tokens` and `completion_tokens` only.

So "cache 0/0 ever" most likely means your tooling has no cache field to read from vLLM, **not necessarily that no caching is happening**. This is a measurement gap. Important correction to where the last message was heading.

**What this means for your 1 billion input.** The billing number is `prompt_tokens` — the logical prompt size sent each turn. That's 1B regardless of whether APC saved GPU compute underneath. The key question is what the platform actually counts you on:

- If it bills/quotas you on `prompt_tokens` (logical tokens sent), APC saving GPU compute doesn't help your number — the fix is entirely **send less context**.
- If it measures actual GPU work, APC already helps and the 1B is less alarming.

Ask devops which they count. Meanwhile the controllable lever is reducing re-sent context: confirm APC is on (`--enable-prefix-caching`), lower `limit.context` to force compaction, session hygiene, context discipline.

## The root cause: no `limit.context`

> there was no limit.context set locally, but it was compacting from time to time

No `limit.context` in your config means OpenCode fell back to the model's default context length, and that default is almost certainly the source of the 1B.

When you don't set `limit.context`, OpenCode uses the model's advertised context limit as the compaction trigger. Compaction fires at roughly `(limit.context − output) × 0.9`. So if the model advertises a 128k or 256k context, compaction doesn't trigger until you're near ~115k–230k tokens. Every session grows to a very large prompt before it compacts even once — and every turn up to that point re-sends the entire accumulated context, uncached, at full `prompt_tokens` cost.

"Compacting from time to time" is consistent with exactly this: it was compacting, but only after the context had already ballooned near the model's max. The compaction was real but **late**.

### The fix: set `limit.context` explicitly and low

```jsonc
"models": {
  "<your-model-id>": {
    "limit": {
      "context": 32000,
      "output": 8000
    }
  }
}
```

With those values, compaction triggers at `(32000 − 8000) × 0.9 = 21,600` tokens instead of near the model max.

Constraints: `limit.context` must be ≤ your vLLM server's `--max-model-len`. Lower context = more frequent compaction = some loss of fine detail earlier. For most coding work 24k–32k effective is fine.

Tuning guidance:

- **Aggressive:** `context: 24000, output: 8000` → compacts at ~14.4k.
- **Balanced:** `context: 32000, output: 8000` → compacts at ~21.6k. Good default.
- **Roomier:** `context: 48000, output: 12000` → compacts at ~32.4k.

Combine with **session hygiene** — a fresh session per task resets the baseline and avoids paying to re-summarise an ever-growing history. The two together are what actually move the number.

## Why one session reaches 32M tokens under a 256k context

> how come some session can reach 32 million input tokens while using advertised context, likely 256k

The arithmetic exposes exactly what's happening. A 256k advertised context can't hold 32M tokens at once, so the 32M is **not context size**. It's context size × number of turns.

The API charges `prompt_tokens` per request. In an agent session, each turn re-sends the entire conversation so far. So the billed input for a session is the **sum** of the prompt size at every turn, not the peak size.

Say compaction keeps the working context hovering around an average of C tokens (well under the 256k ceiling, because compaction trims it back each time). If the session runs N turns, total billed input ≈ C × N. To hit 32M:

- C ≈ 100k average context, N ≈ 320 turns → 32M
- C ≈ 128k average, N ≈ 250 turns → 32M
- C ≈ 160k average, N ≈ 200 turns → 32M

None of those require ever exceeding 256k at any single moment. They just require a large average context sustained over a few hundred tool-loop turns — entirely normal for an agent doing real work (a turn per tool call).

**Why the average context is so high here.** With no `limit.context` set and a 256k default, compaction only fires near ~230k. Between compactions the context climbs toward 230k, then trims, then climbs again. The average it hovers at is a large fraction of 256k — maybe 100k–160k. That's C. This is why compaction "happening from time to time" didn't save you: it fired late, so the sawtooth still averages very high. Lowering `limit.context` to 32k drops C from ~130k to ~20k — a 6–7× cut.

**The compounding factor:** between two compactions, context grows every turn (each tool result appends). So it's not flat at C — it ramps. The sum over a ramp from small up to 230k, repeated across the session, is what produces the big number.

Cut C by 6× (context limit) and cut N by starting fresh (so no single session accumulates 300 turns), and the same work might cost 2–4M instead of 32M.

## Context hygiene, and finding turn counts

> search online for context management and hygiene doing agentic development with opencode. i don't find easily the number of turns for big sessions. any easy clue?

### What the field says

- **Compaction is a safety net, not a strategy.** If you're hitting compaction regularly, you're feeding too much context; fix the input, don't rely on the recovery mechanism. Your sessions were leaning entirely on the net, at a 256k ceiling. That's the core error.
- **One task, one session** — the single highest-value habit, and the direct fix for your turn-count problem. Local context windows don't support long, multi-topic sessions well.
- **Keep AGENTS.md lean** — it's re-sent every turn, so it's a per-turn multiplier just like skill descriptions. Be specific, not exhaustive.
- **Search before reading** — prefer glob and grep to narrow down before reading, and use the read tool's line-range support rather than full reads.

**How OpenCode actually compacts:** a two-phase system. First it prunes verbose old tool outputs, replacing outputs older than the most recent ~40,000 tokens with truncation markers; then it summarises. The summarisation trigger is what your (absent) `limit.context` governs — overflow detection monitors token usage and triggers compaction as conversations approach the context limit, which with no limit set is the 256k default. Confirmed cause.

A plugin option if you want smaller, continuous compactions rather than big late ones: the **Dynamic Context Pruning** plugin makes OpenCode do smaller compactions as a task progresses. I'd fix `limit.context` and session hygiene first, and only add this if you still see bloat.

### The easy turn-count clue

You don't need to count turns manually — three routes, easiest first:

1. **In the TUI, the message count is right there.** A "turn" is roughly one assistant message + its tool calls, so message count ÷ ~2 approximates turns. Crude but instant.
2. **Divide, don't count.** You have input tokens per session from `opencode-usage`. Take the big session's input total and divide by the average context: `32M ÷ 130k ≈ 250 turns`. Conversely, `32M ÷ requests = average context per turn`.
3. **Count message files on disk — the definitive way.** OpenCode stores one JSON file per message per session under `~/.local/share/opencode/storage/message/{sessionID}/`. So the turn count is a file count:

```bash
# messages per session, sorted — biggest sessions surface at the bottom
for d in ~/.local/share/opencode/storage/message/*/; do
  echo "$(ls "$d" | wc -l) $(basename "$d")"
done | sort -n | tail -20
```

The top entries by file count are your longest sessions. Assistant messages ≈ turns, so halve the count for a turn estimate. Cross-reference the session ID with its input total and you've got `input ÷ turns = average context` — the number that proves whether it was "high C" (bloated context, fix with `limit.context`) or "high N" (long session, fix with hygiene), or both.

If you're on OpenCode 1.2+ it may store in SQLite (`opencode.db`) instead of per-file JSON:

```bash
sqlite3 ~/.local/share/opencode/opencode.db \
  "SELECT session_id, COUNT(*) c FROM message GROUP BY session_id ORDER BY c DESC LIMIT 20;"
```

(Run `.schema message` first if the column names differ in your version.)

Run route 3 against your big session. If `input ÷ turns` comes out around 100k–160k, that's confirmation it was late compaction on the 256k ceiling — and `limit.context: 32000` plus one-task-one-session is the whole fix.
