---
title: >-
  The actually-best stack for AI coding agents, derived from the corrected
  criteria
date: '2026-07-13'
status: published
privacy: public
lang: en
tags:
  - ai-agents
  - agentic-development
  - architecture
  - stack
  - typescript
  - postgres
  - type-safety
  - trpc
  - openapi
  - drizzle
  - htmx
  - testcontainers
  - verification
  - code-review
repos: []
skills: []
patterns: []
relatedTo:
  - 2025-11-14-3DSoundViz
description: >-
  A first-principles rebuttal to the "best stack for AI agents" video: the right
  objective isn't first-try generation accuracy but verified throughput per unit
  of human attention. That reframing selects TypeScript-strict end-to-end, a
  typed client/server contract, Postgres with constraints, and non-mocked
  hermetic tests — and it argues the harness beats the stack. Reasoning is
  flagged as inference; the verifiable and current-state claims are sourced.
---

> **Epistemic warning up front:** what follows is first-principles reasoning, which is the *same evidence class as the video I just criticised* — expert opinion, one rung above anecdote. There is, as far as I know, no controlled study varying stack while holding agent and task set constant. I'm being explicit about that because the video wasn't. Take this as a well-specified hypothesis, not a finding. The only hard empirical signal available is indirect: [coding benchmarks are Python- and TypeScript-dominated](https://www.swebench.com/), which tells us where models are strong, and nothing about whether stack choice causes agent success.

---

## 1. The objective function, stated properly

The video's implicit objective was "maximise the probability the model emits correct code first try." That is the wrong objective, because first-try correctness is not what you're buying. What you're buying is **verified throughput per unit of human attention**. Decompose it:

**V = (generation accuracy) × (probability a defect is caught mechanically) × (agent's ability to converge on a fix) ÷ (human review cost)**

Four terms, and the video only optimises the first. Each term implies a different stack property:

| Term | Property it selects for | Proxy |
|---|---|---|
| Generation accuracy | Training-data density **× API stability** | Corpus size; years since last breaking change; ratio of current-idiom to stale-idiom examples in the wild |
| Mechanical defect capture | Verification surface | Static types, checked contracts at every boundary, DB constraints, hermetic tests |
| Convergence | Feedback **legibility and speed** | Compile time; whether the error message tells the model what to do |
| Human review cost | Locality of behaviour; small diffs | Can a human confirm correctness by reading one screen? |

## 2. Four non-obvious consequences

**(a) Rejection is not verification. Convergence is.** This kills the naive "pick the strictest language" answer. Rust maximises mechanical defect capture and is *the wrong choice for agents*, because borrow-checker and lifetime errors are exactly the class of error LLMs thrash on: the compiler correctly rejects, the model shuffles `&`, `clone()`, and `Arc` semi-randomly, and you burn twenty iterations and a lot of tokens converging — sometimes not converging. A verification signal the agent cannot act on is a cost, not a benefit. The optimum is **strict but locally-fixable**: type errors where the fix is mechanically implied by the error message. TypeScript strict and Go both sit near that optimum. Rust does not. *This is inference, and it is the single claim here I'd most like to see tested.*

**(b) Mocks poison the reward signal.** The agent's test suite is its reward function. If the tests mock the database, the HTTP client, and the queue, then "tests pass" is decoupled from "works", and you have handed an optimiser a misspecified objective. It will exploit it — not maliciously, just because that's what optimisers do. **A stack that makes real, hermetic integration testing cheap beats a stack with a better type system and mock-heavy tests.** This is, I think, the highest-leverage property on the whole list and it is almost never discussed.

**(c) Reversibility dominates optimality.** The agent will make architectural mistakes and you will change your mind. Prefer the choice whose *exit cost* is lowest. SQLite's exit — to multi-writer, horizontal scaling, rolling zero-downtime deploys — is expensive and arrives without warning. Postgres never needs an exit. That asymmetry is worth more than SQLite's latency win in almost every case where you're not certain you're single-node forever.

**(d) The human is now the bottleneck, so optimise for reading, not writing.** Generation is free. Review is not. This is the one place the video is entirely right, and it's the strongest argument for server-rendered HTML, boring control flow, and explicit code over clever abstraction.

## 3. Layer-by-layer

### Language

| | Corpus | Verification | Convergence | Verdict |
|---|---|---|---|---|
| **TypeScript (strict)** | Largest of any typed language | Strong: strict mode, discriminated unions, exhaustiveness, `satisfies` | Excellent — errors are local and the fix is implied | **Default winner** |
| **Go** | Large, stable, one obvious way | Moderate: no sum types, no exhaustiveness, `nil` everywhere, errors *not* compiler-enforced | Excellent — fast compiles, blunt errors | Winner when ops simplicity dominates |
| **Python** | Largest overall; best benchmark scores | **Weak.** `mypy --strict` is a permanent uphill battle; most of the ecosystem is untyped; failures are runtime | Good | Best generation, worst capture. Only with `mypy --strict` + Pydantic at every boundary — and even then you're bolting a type system onto a language that resists one |
| **Rust** | Adequate | Best | **Poor** (see 2a) | Wrong tool for this job, despite scoring highest on the naive criterion |

**Pick TypeScript strict.** Its decisive advantage is not the type system in isolation — it's that TS is the only mainstream option that lets you type-check *across the network boundary*, which is where agents actually fail.

### The client/server contract — the thing that actually matters

This is the crux, and it is what the HTMX argument gets exactly backwards. The dominant silent-failure mode in AI-written web apps is a **mismatch between what the server sends and what the client expects**. HTMX's answer to this is: nothing. No contract, no check, silent no-op.

The correct answer is to make the contract a **generated artefact that both sides typecheck against**:

- **[tRPC](https://trpc.io/) / [oRPC](https://orpc.unnoq.com/)** if TS on both ends — the contract *is* the type, there is no artefact to drift.
- **[OpenAPI](https://www.openapis.org/) → generated client** if the backend isn't TS (this is your [FastAPI](https://fastapi.tiangolo.com/features/) path: FastAPI emits an OpenAPI schema from Pydantic models, and you generate the typed client from it — the contract is enforced by codegen, not by discipline).
- **[`templ`](https://templ.guide/) (Go) or JSX-as-template (TS)** if you want the hypermedia model: server-rendered HTML with **compile-time-checked templates**. This gives you every property the video wanted from HTMX (no client state drift, no hydration, model-legible output, small diffs a human can eyeball) *plus* the verification loop HTMX throws away.

Yes, codegen is a build step. The "no build step" purity was never coherent — the video's own stack needs `sqlc` or hand-rolled scanning. A build step that mechanically prevents an entire class of silent failure is the best trade in the whole design.

### Database

**[Postgres](https://www.postgresql.org/).** Not SQLite, unless you are certain you are single-node forever (genuinely: desktop app, local-first, CLI tool, per-tenant isolation with a hard tenancy boundary, or an embedded/edge deployment).

And then: **treat the schema as your last line of defence and your strongest type system.** `NOT NULL`, `CHECK`, foreign keys, `UNIQUE`, enums, and — if multi-tenant — [row-level security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html). The agent will eventually write code that violates an invariant. Constraints are the only layer that stops it reaching the data, and unlike your application types, they cannot be bypassed by a cast. Push every invariant you can into the schema. This is the highest-return, lowest-effort thing on this entire page.

Query layer: **[Drizzle](https://orm.drizzle.team/)** or **[Kysely](https://kysely.dev/)** (types derived from schema, SQL stays visible), [`sqlc`](https://sqlc.dev/) for Go, [SQLAlchemy 2.0 typed](https://docs.sqlalchemy.org/en/20/orm/) for Python. Avoid heavyweight ORMs with implicit lazy-loading and cascade semantics — they hide the runtime behaviour from both the model and the reviewer.

### Front end

If you need genuine client-side state (editors, canvases, real-time collaboration, complex forms): **[React](https://react.dev/) + TS + [TanStack Query](https://tanstack.com/query/latest)**. Not because React is elegant, but because the corpus is enormous, and the typed contract to the server is what removes the silent failures.

If you don't (dashboards, internal tools, CRUD, most SaaS): **server-rendered typed templates**, with [HTMX](https://htmx.org/) or [Alpine](https://alpinejs.dev/) as a thin interaction sprinkle where it earns its place. This is the video's instinct, corrected: keep the hypermedia model, add the compiler.

Avoid, on the API-churn criterion: [Next.js App Router](https://nextjs.org/docs/app) (a huge corpus contaminated by Pages Router idiom; models mix the two constantly), [Svelte 5 runes](https://svelte.dev/docs/svelte/what-are-runes) (rewrite, split corpus), anything mid-major-version-rewrite — which, per the previous review, [currently includes HTMX itself](https://htmx.org/essays/future/).

## 4. The answer

**Default (the "enormous middle" the video was aiming at):**

```
TypeScript strict, end to end
  ├── Server: Hono or Fastify (small, stable, typed)
  ├── Contract: tRPC/oRPC (TS client) or OpenAPI codegen (other clients)
  ├── UI: server-rendered typed templates + light HTMX/Alpine
  │        OR React + TanStack Query if real client state
  ├── DB: Postgres, schema-first, constraints everywhere, RLS if multi-tenant
  ├── Query: Drizzle
  ├── Tests: Vitest + testcontainers Postgres, no mocks at boundaries
  └── Deploy: one container image
```

**Ops-simplicity variant (Go):** Go + `templ` + HTMX + `sqlc` + Postgres. Single binary, compile-time-checked templates, compile-time-checked SQL. This is the video's stack with its one broken part fixed and its one over-reach (SQLite) made conditional. If you want the video's aesthetic, build *this*.

**Genuinely single-node / local-first / embedded:** then, and only then, SQLite with [`STRICT`](https://www.sqlite.org/stricttables.html) tables, [WAL](https://www.sqlite.org/wal.html), and [Litestream](https://litestream.io/) with a stated RPO.

## 5. The uncomfortable conclusion: the harness beats the stack

*Inference, stated as such — but I hold it strongly.* I suspect the variance in agent success rate explained by **stack choice** is small compared to the variance explained by:

1. **One command that runs everything.** `make check` → typecheck, lint, test, build. If the agent has to guess how to verify its work, it won't.
2. **Fast, hermetic, non-mocked tests.** Under ~60s, real database, no network. This is the reward signal. Get it wrong and nothing else matters.
3. **A conventions file** (`AGENTS.md`/`CLAUDE.md`) that encodes what the corpus doesn't know: your idioms, your boundaries, what not to touch.
4. **Small, bounded modules** with explicit interfaces, so a wrong answer has a small blast radius and a small diff.
5. **Constraints in the schema**, per above.

A React/Postgres/TypeScript codebase with all five will beat a Go/HTMX/SQLite codebase with none of them, by a distance. The video sold a stack because a stack is a purchasable identity and a harness is unglamorous work. The unglamorous work is where the wins are.

---

## Sources

The argument above is first-principles reasoning — expert opinion, flagged as such throughout (see the epistemic warning, and claims **2a** and **§5**, which are explicitly labelled inference). The citations below back only the **verifiable factual and current-state claims**; they do *not* turn the reasoning into a finding. No controlled study varying stack while holding agent and task set constant is cited here because, as far as I know, none exists.

**The one hard empirical signal — coding benchmarks are Python-dominated:**

- **Jimenez, Yang, Wettig et al. (2023), "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?"** — [arXiv:2310.06770](https://arxiv.org/abs/2310.06770). 2,294 issue–PR instances drawn from **12 Python repositories**; the flagship agentic-coding benchmark is Python-only at its core. Multilingual extensions ([swebench.com](https://www.swebench.com/)) report models strongest on Python and Java, attributed to their preponderance in pretraining corpora.
- **Chen, Tworek, Jun et al. (2021), "Evaluating Large Language Models Trained on Code"** (Codex / HumanEval) — [arXiv:2107.03374](https://arxiv.org/abs/2107.03374). HumanEval, the canonical code-generation benchmark, is **Python-based**.

**Current-state / API-churn claims (the "avoid" list):**

- **HTMX is mid-internals-rewrite.** The next major is htmx **4.0**, rebuilt on `fetch()` and lessons from `fixi.js`, with explicit (not implicit) attribute inheritance and network-based history — a multi-year rollout expected to land in 2026 and only become "latest" around 2027. See ["The future of htmx"](https://htmx.org/essays/future/) and ["The fetch()ening"](https://htmx.org/essays/the-fetchening/).
- **Svelte 5 replaced the reactivity model with runes** (`$state`/`$derived`/`$effect` in place of `let` + `$:`), a compiler-level rewrite with an official migration tool — [Svelte 5 migration guide](https://svelte.dev/docs/svelte/v5-migration-guide), ["Introducing runes"](https://svelte.dev/blog/runes).
- **Next.js ships two parallel routing models** — the newer [App Router](https://nextjs.org/docs/app) alongside the legacy [Pages Router](https://nextjs.org/docs/pages) — which is exactly the split-corpus / idiom-mixing hazard described.

**Tooling referenced (official docs):**

- Contract: [tRPC](https://trpc.io/), [oRPC](https://orpc.unnoq.com/), [OpenAPI](https://www.openapis.org/), [FastAPI's automatic OpenAPI generation](https://fastapi.tiangolo.com/features/), [`templ`](https://templ.guide/).
- Database & queries: [PostgreSQL](https://www.postgresql.org/), [Postgres row-level security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [Drizzle](https://orm.drizzle.team/), [Kysely](https://kysely.dev/), [`sqlc`](https://sqlc.dev/), [SQLAlchemy 2.0](https://docs.sqlalchemy.org/en/20/orm/); [SQLite `STRICT` tables](https://www.sqlite.org/stricttables.html), [WAL mode](https://www.sqlite.org/wal.html), [Litestream](https://litestream.io/).
- Servers & runtime: [Hono](https://hono.dev/), [Fastify](https://fastify.dev/).
- Front end: [React](https://react.dev/), [TanStack Query](https://tanstack.com/query/latest), [HTMX](https://htmx.org/), [Alpine.js](https://alpinejs.dev/).
- Tests: [Vitest](https://vitest.dev/), [Testcontainers](https://testcontainers.com/).
- Conventions file: [`AGENTS.md`](https://agents.md/).
