---
title: >-
  Angular 21 testing: RTL-style with Testing Library + Vitest (and the
  templateUrl gotcha)
date: '2026-07-01'
status: published
privacy: public
lang: en
tags:
  - angular
  - testing
  - vitest
  - testing-library
  - playwright
  - e2e
  - frontend
  - typescript
repos: []
skills: []
patterns: []
relatedTo:
  - 2025-11-14-3DSoundViz
  - 2026-07-03-dox-openspec-scaffold-en
description: >-
  Choosing a React-Testing-Library-style stack for Angular 21: Angular Testing
  Library on Vitest for components, Playwright for full pages — and why the
  "Vitest can't resolve templateUrl" error is almost always a config problem,
  not a framework bug.
---

> Published as-is, no translation. A working session on picking an RTL-style testing stack for Angular 21 — and running down the `templateUrl`/`styleUrls` resolution error that turns out to be an invocation problem, not a Vitest limitation.

## An RTL equivalent for Angular 21?

> ui component and full page testing for angular 21 like RTL?

For Angular 21, the closest equivalent to React Testing Library is the **Angular Testing Library** (`@testing-library/angular`), which is a wrapper around Angular's own primitives and follows the same user-centric philosophy as RTL.

Here's the current landscape:

### Component / page testing (RTL-style)

`@testing-library/angular` — the direct RTL analogue. Same `render`, `screen`, `getByRole`, `userEvent` API. Built on `@testing-library/dom`. Works with both `TestBed` and standalone components. This is what you want if you like RTL's "test behaviour, not implementation" approach.

Note on the underlying runner: Angular has been moving away from Karma/Jasmine. As of Angular 21, the Vitest test runner is the recommended/default path (Karma is deprecated and being removed). Angular Testing Library runs fine on Vitest, Jest, or the legacy Karma setup. I'm fairly confident Vitest is the default in 21, but verify against the release notes since this shifted across 19→21 and I want to flag it rather than assert it as settled.

### Full-page / end-to-end testing

Angular dropped its built-in Protractor support some releases back. The recommended E2E options now are:

- **Playwright** — generally the strongest current choice for full-page testing; good Angular integration, parallelism, tracing.
- **Cypress** — mature, good DX, large ecosystem.

The Angular CLI's `ng e2e` lets you scaffold either via community builders.

### Practical split

For component and integration tests that mimic real user interaction (RTL-style), use `@testing-library/angular` on Vitest. For true full-page flows across routes, navigation, and real browser, use Playwright. They cover different layers and are complementary.

One caveat: Angular Testing Library tends to lag a major version or two behind the newest Angular release for official "supported" status. With Angular 21 being recent, check the package's peer-dependency support before assuming clean compatibility — this is the most likely friction point.

## Community size, and is Vitest the right call?

> how big is the community? is it better to use vitest for angular?

### Community size

`@testing-library/angular` sits at roughly 232,000 weekly downloads and ~790 GitHub stars (latest version 19.4.1). That's a healthy-but-not-dominant position. For context within the Angular testing-utility ecosystem:

- **ng-mocks** — ~436k weekly downloads (mocking helpers, complementary rather than competing)
- **@testing-library/angular** — ~232k
- **@ngneat/spectator** — ~176k weekly downloads, but ~2,180 stars (more stars, fewer downloads)

So in absolute terms it has a solid, active user base, but it's smaller than the broader React Testing Library community (RTL pulls millions of weekly downloads in the React world). The low star count relative to downloads is normal for a thin wrapper library — people use it without starring it. The core philosophy, docs, and `screen`/`getByRole`/`userEvent` API are shared with the whole Testing Library family, so the effective community knowledge you can draw on is far larger than the Angular-specific numbers suggest. Most RTL patterns transfer directly.

One blunt caveat: it lags Angular's version cadence. Current ATL is on v19.x while Angular core is at 21. It works on 21 (the API is stable), but official peer-dep alignment trails, so check before assuming clean install.

### Is Vitest better for Angular?

For Angular 21, this isn't really a "better" question any more — it's the default and the stated future. The Angular CLI integrates Vitest as the new default test runner; Vitest support is now stable and production ready, and new Angular applications no longer include zone.js by default. Karma was deprecated back in Angular 16. With Vitest support being stable, the team also deprecated the experimental Web Test Runner and Jest support and plans to remove them in v22.

So for a new Angular 21 project: use Vitest. There's no real argument otherwise. `ng new` scaffolds it for you.

Concrete reasons it's better than the Karma status quo:

- **Speed.** Vitest runs test files in parallel using worker threads by default, and uses native V8 coverage rather than Babel/Istanbul instrumentation, so coverage is nearly free in performance terms.
- **No browser dependency in CI.** You no longer need Chrome or puppeteer configured in Docker images — a standard Node.js container is all you need, which removes a common source of flaky CI timeouts.
- **Modern feature fit.** It aligns with the signals/zoneless direction Angular 21 has taken.

The one real trade-off, stated bluntly: the biggest mental shift is accepting that JSDOM (or happy-dom) is not a full browser. Vitest uses a DOM emulation library by default — the CLI auto-detects happy-dom if installed, otherwise falls back to jsdom. If you test things that depend on real browser layout/APIs, you'll either hit gaps and need mocks, or opt into browser mode. Vitest can still run in a real browser via browser mode using a Playwright-backed provider; in Angular's migration guide this is positioned as an optional step (install `@vitest/browser-playwright` and set a `browsers` option).

For an existing project, the nuance matters: while Vitest is the new default, Karma and Jasmine are still fully supported, so you don't need to migrate yet. But migrating an existing project to Vitest is still officially considered experimental, and requires the application build system (the default for new projects). There's an auto-refactor schematic (`refactor-jasmine-vitest`) that converts spies/mocks, but it's flagged experimental and won't catch every pattern.

Bottom line: ATL + Vitest is the right stack for Angular 21. Vitest because it's the default, fast, and where the framework is heading; ATL because it gives you the RTL-style user-centric testing you asked for and runs cleanly on Vitest. Importantly, `TestBed.configureTestingModule`, `TestBed.inject`, and `TestBed.createComponent` work identically under Vitest — only your spies change — so ATL's reliance on TestBed internals isn't a compatibility risk.

## A reference article for the stack

> find an article that describes the setup and usage for this stack

The single best fit for your exact stack (Angular 21 + Vitest + Testing Library) is **Tim Deschryver's** article. He's a maintainer of `@testing-library/angular`, so it's an authoritative source rather than a third-party tutorial:

- *"Angular Testing Library with Vitest"* — Tim Deschryver — `https://timdeschryver.dev/blog/angular-testing-library-with-vitest`

His core finding, stated plainly: the short answer is that it just works — you can use Angular Testing Library with Vitest without any issues, because Testing Library is not a test runner and works with any runner that has a DOM implementation, including Jest, Jasmine, and Vitest. The article covers both the official Angular CLI Vitest path (v20+) and the AnalogJS bridge, plus the `@testing-library/jest-dom/vitest` matcher setup, with example repos.

Three more worth knowing, by use case:

- **Most complete end-to-end Angular 21 walkthrough** (build a task manager, signals, change detection gotchas) — DEV Community, Dec 2025, with full GitHub repo: `https://dev.to/olayeancarh/testing-angular-21-components-with-vitest-a-complete-guide-8l2`
- **Official Angular docs** — the canonical setup reference for the Vitest builder, CI config, and browser mode: `https://angular.dev/guide/testing`
- **Best for real-world async patterns** (browser mode, ARIA locators, `httpResource` mocking, fake timers) — Sebastian Puchet, written from an actual Angular 17→21 migration: `https://www.sebastianpuchet.com/blog/testing-modern-angular-vitest-browser-mode`

One important nuance flagged by these sources that affects which you follow: Angular 21's default isn't just Vitest-on-jsdom. One account says the default is now Vitest with browser mode, running component tests in real Chromium via Playwright rather than jsdom. The official docs, though, describe Vitest running tests in Node.js using jsdom by default, with happy-dom as a swap-in and browser mode as an opt-in via a provider. These two accounts conflict on what the out-of-the-box default DOM environment is — I can't fully resolve which is correct without testing `ng new` on 21 directly, so treat the browser-mode-by-default claim as not fully confirmed and verify against your own scaffold. It matters because browser mode changes some assertion syntax (`expect.element()` and Vitest's own locators can partly overlap with ATL's `screen` queries).

Start with Deschryver for the ATL+Vitest integration specifically, then Puchet for the async/real-browser patterns.

## "Vitest can't resolve templateUrl/styleUrls" — bug or config?

> apparently vitest can't resolve templateUrl/style urls; getComponentDef called during configureTestingModule can't resolve template file. is it correct or is it due to wrong config?

Short answer: it's a configuration issue, not a fundamental Vitest limitation. But the specifics matter.

### What the error actually means

The message `Component 'X' is not resolved ... Did you run and wait for 'resolveComponentResources()'?` comes from Angular's JIT compiler. `templateUrl`/`styleUrls` are external files that must be fetched and inlined before `getComponentDef` runs during `configureTestingModule`. When tests run through the CLI's ahead-of-time pipeline, that inlining happens at build time, so the compiler never sees a raw `templateUrl` at test time. When the resolution step is skipped or misconfigured, the compiler reaches the component with the URL still unresolved and throws.

So conceptually this is a known, general Angular-testing failure mode. External `templateUrl`/`styleUrls` tell the compiler to read external files during compilation; that's fine under `ng test` because it compiles the app first, but in a non-CLI environment tests of such a component can fail with a message that the `templateUrl`/`styleUrls` were never compiled. The classic fix in that world is `await TestBed...compileComponents()`.

### In your specific case (Angular 21 + Vitest), it's more than config

There are open bugs filed against Angular exactly matching your symptom:

- **angular/angular-cli #32055** (Dec 2025): on Angular 21 + Vitest, any standalone component using external `templateUrl` or `styleUrls` fails during TestBed compilation, even in the smallest possible project with one component and no dependencies; inline templates/styles work, external ones always fail. The reporter notes it fails even with `TestBed.initTestEnvironment` manually set up.
- **angular/angular #66793** (Jan 2026): same `resolveComponentResources()` error on a pure Angular 21.1.1 starter with external template and styles.

So the honest answer to "is it correct or wrong config": both are partly true. The `@angular/build:unit-test` builder is supposed to run the same resource-inlining transform that the app build does, so external templates should just work under `ng test`. That it reproducibly doesn't, in minimal projects, is why these were filed as framework/CLI bugs rather than closed as user error.

### Practical resolution, in order of preference

**First, confirm how you're running tests.** This is the most common genuine config cause. The bug bites hardest when Vitest is invoked directly (`vitest run`) rather than through the Angular builder. If you bypass `ng test` / `@angular/build:unit-test`, you lose Angular's resource-inlining plugin entirely, and then it *is* a config problem. Run through `ng test` (or ensure your `angular.json` test target uses `@angular/build:unit-test`) rather than raw Vitest.

**Second, if you're already going through the builder and still failing**, you're likely on the bug. Options: inline the template/styles as a workaround (inline always resolves); pin/upgrade versions and watch those two issues; or, if using AnalogJS's `@analogjs/vitest-angular` rather than the first-party builder, its Vite plugin handles the Angular resource resolution and is more battle-tested for this specific problem.

## Resolving it: pulling the issue status

> yes [pull the current status of those two GitHub issues]

**Key finding on #66793:** it was closed as "not planned" by the Angular team. That's the important signal. The maintainers didn't treat it as a framework bug to fix — which points toward the reproduction's config/invocation being the cause, not core Angular. The repro (`mareklukac/angularVitestTesting`) runs Vitest in a way that bypasses the resource-inlining step, and the team declined it.

That settles it. Both reproductions confirm the diagnosis: it's a configuration/invocation problem, not an Angular or Vitest defect.

Look at the smoking gun in both repros — the `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Both bug reporters are calling `vitest run` directly instead of `ng test`. The reporter of #32055 even diagnoses the mechanism correctly in their own "Background" section, then mislabels the conclusion as a bug: `resolveComponentResources()` is normally invoked automatically via the Angular CLI, but when Vitest runs standalone, the CLI is not invoked, no resource loader runs, and external template/scss paths remain unresolved so TestBed compilation fails before instantiation.

That's exactly right as a description — and it's precisely why it's a config error, not a framework bug. The Angular team's response confirms this reading: #66793 was closed as "not planned"; #32055 remains as a user question with the same root cause (direct `vitest run`). If external templates were genuinely broken under the supported test path, it would be a P-critical fix, not a wontfix.

### Why this happens, precisely

The resource inlining that converts `templateUrl` → inline `template` is done by the Angular build system (`@angular/build:unit-test`), which wraps Vitest and injects the compiler plugin. Invoke Vitest directly and you get a bare Vitest process with none of Angular's compilation pipeline. `getComponentDef` then sees an uncompiled component with a raw `templateUrl` and throws during `configureTestingModule`. `compileComponents()` doesn't save you, because in a JIT/browser context it would need to `fetch()` the file — and the resolver that makes that work was never wired up.

### The fix

Run tests through the Angular builder, not raw Vitest. Your `package.json` should be:

```json
"scripts": {
  "test": "ng test",
  "test:watch": "ng test"
}
```

and your `angular.json` test target must use the Angular builder:

```json
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "runnerConfig": "vitest.config.ts"
  }
}
```

With `ng test`, the CLI compiles the app first (inlining all external templates and styles), then hands off to Vitest. External `templateUrl`/`styleUrls` resolve exactly as they did under Karma. No inlining of your components required.

So, directly answering the original question: your instinct that it might be wrong config was correct. Vitest *can* resolve `templateUrl`/`styleUrls` in Angular 21 — but only when driven by `@angular/build:unit-test`. The moment you shell out to `vitest run` yourself, you strip out Angular's compilation step and hit exactly this error. Check your test script first; that's almost certainly the culprit.

One caveat: if you're on AnalogJS's `@analogjs/vitest-angular` builder rather than the first-party one, the wiring differs (its Vite plugin does the resolution), and there have been separate edge cases there — but the same principle holds: the resolution must be driven by an Angular-aware builder, never bare Vitest.
