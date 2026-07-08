# Keycloak in Angular 21 — implementation context pack

A small, self-contained bundle that gets **Keycloak** authentication into an
existing **Angular 21** app (standalone, signals, zoneless) using
`keycloak-angular@21` + `keycloak-js@26`, following mid-2026 best practices:
Authorization Code + PKCE `S256`, a URL-scoped bearer-token interceptor,
functional role guards, signal-based auth state, and auto token refresh.

It is built to be **read and applied by a small/medium local coding model**
(Qwen-Coder, Codestral, a 7–32B model behind Ollama/vLLM, etc.). Every file is
short, imperative, and self-contained, so a model with a modest context window
can load only the piece it needs.

Background / narrative version:
<https://vanmarkic.github.io/mycelium-blog/posts/2026-07-08-keycloak-angular-21-en>

## What's in here

| File | What it is |
|------|------------|
| `llms.txt` | Index/router (per llmstxt.org). Point the model here first; it links each recipe with a one-line description so the model loads only what it needs. |
| `llms-full.txt` | Every recipe + source file concatenated into one document — for models that prefer a single blob over selective fetches. |
| `APPLY.md` | The ordered steps a coding agent should follow, with an acceptance checklist. |
| `recipes/00..10` | Self-contained task files (overview, install, bootstrap, interceptor, guards, auth store, silent SSO, logout, server checklist, testing, gotchas). |
| `src/` | Ready-to-copy source files with real paths — change only `environment.ts`. |
| `install.sh` | Drops the whole pack into a target repo so a local agent can read it. |

## Use it with a local model

**Option A — point the model at the index (recommended).** Fetch `llms.txt`, let
the model pick the recipes it needs, then apply. With OpenCode / a local agent:

```bash
# from your Angular project root, pull the pack in for the agent to read:
curl -fsSL https://vanmarkic.github.io/mycelium-blog/keycloak-angular/install.sh | bash
# then, in your local-model agent:
#   "Read .keycloak-angular-pack/APPLY.md and apply it to this repo."
```

**Option B — one blob.** If your model does better with everything in context at
once, feed it `llms-full.txt` plus your `app.config.ts` and `app.routes.ts`.

**Option C — RAG.** Index `recipes/*.md` and retrieve by task ("bearer token",
"role guard", "logout"). Each recipe is a clean, standalone chunk.

## Manual install

```bash
mkdir -p .keycloak-angular-pack
BASE=https://vanmarkic.github.io/mycelium-blog/keycloak-angular
curl -fsSL $BASE/APPLY.md   -o .keycloak-angular-pack/APPLY.md
curl -fsSL $BASE/llms.txt   -o .keycloak-angular-pack/llms.txt
# ...or just run install.sh, which fetches every file.
```

Or download everything as one archive:

- `keycloak-angular-context-pack.zip`
- `keycloak-angular-context-pack.tar.gz`

## Versions (July 2026)

| Package | Pin | Note |
|---|---|---|
| `keycloak-angular` | `^21` | Major must match your Angular major (Angular 21 → 21; latest overall is 22). |
| `keycloak-js` | `^26` | Peer dependency. |
| Keycloak server | 26.x | Server version is decoupled from `keycloak-js`. |

## Caveats

- **Client-side auth is UX, not security.** Guards and interceptors improve the
  user experience; your API must independently validate the token and enforce
  roles server-side.
- **Silent SSO depends on browser cookie policy.** Strict third-party-cookie
  settings can make it fall back to "logged out"; that is expected.
- Code is verified against `keycloak-angular@21` / `keycloak-js@26` as of July
  2026. Confirm exact export names against your installed version's `.d.ts` if you
  pin a different major.

MIT-licensed, like the rest of the blog.
