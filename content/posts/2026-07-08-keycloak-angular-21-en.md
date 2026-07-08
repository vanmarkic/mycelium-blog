---
title: 'Keycloak in Angular 21 — best-practice auth, packaged for a local AI to apply'
date: '2026-07-08'
status: published
privacy: public
lang: en
tags:
  - keycloak
  - angular
  - authentication
  - oauth
  - oidc
  - pkce
  - security
  - signals
  - frontend
  - typescript
  - llms-txt
  - local-llm
  - agentic-development
  - context-engineering
repos: []
skills: []
patterns: []
relatedTo:
  - 2025-11-14-3DSoundViz
description: >-
  A best-practice Keycloak setup for Angular 21 (standalone, signals, zoneless)
  with keycloak-angular 21 + keycloak-js 26 — Authorization Code + PKCE S256, a
  URL-scoped bearer interceptor, functional role guards, and signal-based auth
  state. Shipped as a downloadable context pack (llms.txt + recipes) built for a
  small/medium local model to read and apply to your codebase.
---

> Two deliverables in one. The first is the usual thing: a best-practice Keycloak wiring for **Angular 21**, with the code that matters inline. The second is the point — that same guidance packaged as a **context pack a small, local coding model can read and apply to your own repo**: an `llms.txt` index, self-contained recipes, and ready-to-copy source files. Everything is downloadable from this page. Verified against `keycloak-angular@21` / `keycloak-js@26` in July 2026; version-sensitive claims are flagged.

Most "how to add Keycloak to Angular" guides are written for a human to read once and adapt by hand. I wanted something a **7–32B local model** — Qwen-Coder, Codestral, whatever you run behind Ollama or vLLM — could ingest and actually apply to an existing codebase without hallucinating the API. That constraint shaped the whole thing: short files, one task each, exact code, explicit paths, no "left as an exercise."

So this post is both the human version and the front door to the machine version.

## The stack, and the versions to pin

The single most common way to break this is installing the wrong major. **`keycloak-angular`'s major version tracks Angular's major.**

| Package | Pin for Angular 21 | Note |
|---|---|---|
| `keycloak-angular` | `^21` | Angular 21 → 21. The latest overall is **22** (for Angular 22); don't install `latest` blindly. |
| `keycloak-js` | `^26` | Peer dependency; latest is 26.2.x. |
| Keycloak **server** | 26.x | Server version is decoupled from `keycloak-js`. |

```bash
npm install keycloak-angular@^21 keycloak-js@^26
```

The default decisions, all applied by the pack: **Authorization Code flow + PKCE `S256`** (never implicit flow), a **public** client (a browser can't keep a secret), **silent SSO** so anonymous users still load the app, a **URL-scoped** bearer token, **signal-based** auth state, and **functional** guards/interceptors — no NgModules, no class guards.

## Get it (everything downloads from here)

**One-click, the whole pack:**

<p>
<a href="/mycelium-blog/keycloak-angular/keycloak-angular-context-pack.zip" download><strong>⬇ keycloak-angular-context-pack.zip</strong></a>
&nbsp;·&nbsp;
<a href="/mycelium-blog/keycloak-angular/keycloak-angular-context-pack.tar.gz" download>.tar.gz</a>
</p>

**Or drop it straight into a repo for your agent to read:**

```bash
curl -fsSL https://vanmarkic.github.io/mycelium-blog/keycloak-angular/install.sh | bash
# then, in your local-model agent:
#   "Read .keycloak-angular-pack/APPLY.md and apply it to this repo."
```

**Or grab individual files** (each saves on click):

- Index & apply: <a href="/mycelium-blog/keycloak-angular/llms.txt" download>llms.txt</a> · <a href="/mycelium-blog/keycloak-angular/llms-full.txt" download>llms-full.txt</a> · <a href="/mycelium-blog/keycloak-angular/APPLY.md" download>APPLY.md</a> · <a href="/mycelium-blog/keycloak-angular/README.md" download>README.md</a> · <a href="/mycelium-blog/keycloak-angular/install.sh" download>install.sh</a>
- Recipes: <a href="/mycelium-blog/keycloak-angular/recipes/00-overview.md" download>00 overview</a> · <a href="/mycelium-blog/keycloak-angular/recipes/01-install.md" download>01 install</a> · <a href="/mycelium-blog/keycloak-angular/recipes/02-app-config.md" download>02 app.config</a> · <a href="/mycelium-blog/keycloak-angular/recipes/03-bearer-interceptor.md" download>03 interceptor</a> · <a href="/mycelium-blog/keycloak-angular/recipes/04-route-guards.md" download>04 guards</a> · <a href="/mycelium-blog/keycloak-angular/recipes/05-auth-store.md" download>05 auth store</a> · <a href="/mycelium-blog/keycloak-angular/recipes/06-silent-check-sso.md" download>06 silent SSO</a> · <a href="/mycelium-blog/keycloak-angular/recipes/07-logout-token.md" download>07 logout/token</a> · <a href="/mycelium-blog/keycloak-angular/recipes/08-keycloak-server.md" download>08 server</a> · <a href="/mycelium-blog/keycloak-angular/recipes/09-testing.md" download>09 testing</a> · <a href="/mycelium-blog/keycloak-angular/recipes/10-gotchas.md" download>10 gotchas</a>
- Ready-to-copy source: <a href="/mycelium-blog/keycloak-angular/src/app/app.config.ts" download>app.config.ts</a> · <a href="/mycelium-blog/keycloak-angular/src/app/core/auth/bearer-token.conditions.ts" download>bearer-token.conditions.ts</a> · <a href="/mycelium-blog/keycloak-angular/src/app/core/auth/auth-role.guard.ts" download>auth-role.guard.ts</a> · <a href="/mycelium-blog/keycloak-angular/src/app/core/auth/auth.store.ts" download>auth.store.ts</a> · <a href="/mycelium-blog/keycloak-angular/src/app/app.routes.ts" download>app.routes.ts</a> · <a href="/mycelium-blog/keycloak-angular/src/environments/environment.ts" download>environment.ts</a> · <a href="/mycelium-blog/keycloak-angular/src/public/silent-check-sso.html" download>silent-check-sso.html</a> · <a href="/mycelium-blog/keycloak-angular/src/main.ts" download>main.ts</a>

The rest of this post walks the load-bearing pieces. Full detail for each lives in the recipe it links to.

## Bootstrap: `provideKeycloak` in `app.config.ts`

Angular 21 boots standalone, so all the wiring is providers. `provideKeycloak` initialises the adapter before the app renders and registers the `Keycloak` instance plus an event signal in DI.

```typescript
// src/app/app.config.ts  (full file in the pack)
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideKeycloak, withAutoRefreshToken,
  AutoRefreshTokenService, UserActivityService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, includeBearerTokenInterceptor,
} from 'keycloak-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeycloak({
      config: { url: environment.keycloak.url, realm: environment.keycloak.realm, clientId: environment.keycloak.clientId },
      initOptions: {
        onLoad: 'check-sso',                                       // silent SSO; 'login-required' to force login
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.origin + '/',
        pkceMethod: 'S256',                                        // 'S256' | false — there is NO 'plain'
        checkLoginIframe: false,                                   // session iframe needs 3rd-party cookies; off
      },
      features: [ withAutoRefreshToken({ sessionTimeout: 300000, onInactivityTimeout: 'logout' }) ],
      providers: [
        AutoRefreshTokenService, UserActivityService,             // required by withAutoRefreshToken
        { provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: bearerTokenConditions }, // array, NOT multi:true
      ],
    }),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideRouter(routes),
  ],
};
```

Two things people get wrong here: `pkceMethod` is `'S256' | false` (no `'plain'`), and `withAutoRefreshToken` throws at runtime unless `AutoRefreshTokenService` and `UserActivityService` are in that nested `providers` array. Detail: [recipe 02](/mycelium-blog/keycloak-angular/recipes/02-app-config.md).

## The security bit: scope the bearer token

The interceptor adds `Authorization: Bearer <token>` — but a token is a credential, and if your interceptor matches every URL, it ships that credential to every host you call. So you allow-list origins you own:

```typescript
// src/app/core/auth/bearer-token.conditions.ts
export const bearerTokenConditions = [
  createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /^(https:\/\/api\.myapp\.com)(\/.*)?$/i,   // anchored to YOUR origin
  }),
];
```

`INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG` is a single token holding that array (provide with `useValue`, not `multi: true`). Add more API hosts as separate conditions rather than widening one pattern. The interceptor also calls `updateToken()` for you, so requests always carry a fresh token. Detail: [recipe 03](/mycelium-blog/keycloak-angular/recipes/03-bearer-interceptor.md).

## Route guards with role checks

`createAuthGuard` builds a functional `CanActivateFn`; your callback gets `{ authenticated, grantedRoles, keycloak }`. The one non-obvious trap is Angular's injection context:

```typescript
const isAccessAllowed = async (route, state, authData: AuthGuardData): Promise<boolean | UrlTree> => {
  const router = inject(Router);            // capture DI BEFORE the first await — context is synchronous
  const { authenticated, grantedRoles, keycloak } = authData;

  if (!authenticated) {
    await keycloak.login({ redirectUri: window.location.origin + state.url });
    return false;
  }
  const need = route.data['realmRole'] as string | undefined;
  if (need && !grantedRoles.realmRoles.includes(need)) return router.parseUrl('/forbidden');
  return true;
};
export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);
```

`grantedRoles` is `{ realmRoles: string[]; resourceRoles: { [clientId]: string[] } }`, so you can gate on realm roles or per-client roles from route `data`. Detail: [recipe 04](/mycelium-blog/keycloak-angular/recipes/04-route-guards.md).

## Auth state as signals

`keycloak-angular` exposes events as an Angular `Signal` (`KEYCLOAK_EVENT_SIGNAL`), which is exactly what you want in a zoneless app. Wrap it in a small store:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly keycloak = inject(Keycloak);            // import Keycloak from 'keycloak-js' (NOT keycloak-angular)
  private readonly kcEvent = inject(KEYCLOAK_EVENT_SIGNAL);
  readonly authenticated = this._authenticated.asReadonly();
  readonly username = computed(() => this._profile()?.username ?? null);

  constructor() {
    effect(() => {
      const event = this.kcEvent();                        // re-runs on every Keycloak event
      if (event.type === KeycloakEventType.Ready) this.setAuthenticated(typeEventArgs<ReadyArgs>(event.args));
      // ...AuthSuccess / AuthRefreshSuccess / AuthLogout / TokenExpired
    });
  }
}
```

The subtle bug bait: **`Keycloak` is imported from `keycloak-js`, not `keycloak-angular`** — the class isn't re-exported. `inject(Keycloak)` still resolves because `provideKeycloak` registered the instance. Full store (profile, roles, login/logout) in [recipe 05](/mycelium-blog/keycloak-angular/recipes/05-auth-store.md), and the template just reads `auth.authenticated()` / `auth.username()` with `@if`.

## The two easy-to-forget pieces

**`silent-check-sso.html`** — a three-line static file served at your web root, allow-listed as a redirect URI, or silent SSO fails and every user looks anonymous ([recipe 06](/mycelium-blog/keycloak-angular/recipes/06-silent-check-sso.md)). **The Keycloak client itself** — public, Standard Flow on, implicit off, PKCE S256, tight redirect URIs, exact Web Origins (never `*`), and post-logout redirect URIs so RP-initiated logout returns cleanly ([recipe 08](/mycelium-blog/keycloak-angular/recipes/08-keycloak-server.md)).

## Why this shape is friendly to a small local model

This is the part that made it more than a tutorial. Small models fail on long, discursive docs in predictable ways: they lose the thread across sections, invent API names that "sound right," and skip steps that were implied rather than stated. So the pack is built against those failure modes:

- **`llms.txt` as a router.** Per the [llmstxt.org](https://llmstxt.org) convention: an H1, a one-paragraph summary, then link lists with a one-line description each. A model reads the index and pulls only the recipe it needs, instead of swallowing everything and drowning.
- **One task per file, self-contained.** Each recipe carries its own imports and full code. No "see above." A model can load `03-bearer-interceptor.md` alone and finish the task — which is also what makes the files clean RAG chunks.
- **Imperative and exact.** Numbered steps, exact `npm install` lines, exact file paths, copy-pasteable code with the real export names — the surface a model is most likely to hallucinate.
- **`APPLY.md` with an acceptance checklist.** An ordered plan plus a list of things to verify, so an agent can check its own work instead of declaring victory early.
- **A single-blob fallback (`llms-full.txt`)** for models that do better with everything in context than with selective fetches.

It's the same "one fact, one home, keep the per-turn context small" instinct behind the [dox + OpenSpec scaffold](/mycelium-blog/posts/2026-07-03-dox-openspec-scaffold-en) — applied to a one-shot implementation task instead of a repo's standing memory.

## Gotchas (the ones that actually bite)

Condensed from [recipe 10](/mycelium-blog/keycloak-angular/recipes/10-gotchas.md):

- Import `Keycloak` from `keycloak-js`, not `keycloak-angular`.
- `pkceMethod` is `'S256' | false`; there is no `'plain'`.
- `INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG` uses `useValue: [ ...conditions ]`, not `multi: true`.
- `inject()` before the first `await` in the guard, or it throws.
- `withAutoRefreshToken` needs `AutoRefreshTokenService` + `UserActivityService`.
- Pin `keycloak-angular` to your Angular major.
- The legacy `KeycloakService` / `KeycloakAuthGuard` / `KeycloakBearerInterceptor` are **deprecated, not removed** — don't build new code on them.

## Honest caveats

- **Client-side auth is UX, not security.** Guards and interceptors make the app pleasant; your API must independently validate the token and enforce roles. A guard only hides a link.
- **Silent SSO depends on the browser's cookie policy.** Under strict third-party-cookie settings (Safari, hardened Chrome) it can fall back to "logged out." That's expected; `silentCheckSsoFallback` (default `true`) and `checkLoginIframe: false` are mitigations, not guarantees.
- **`AuthLogout` fires reliably only with the session iframe on.** With `checkLoginIframe: false` you mostly get `Ready` / `AuthSuccess` / `AuthRefreshSuccess` / `TokenExpired` — which is why the store derives state from those too.
- **Versions move.** The code is verified against `keycloak-angular@21` / `keycloak-js@26` as of July 2026. If you pin a different major, confirm the export names against your installed version's `.d.ts` — the pack tells the applying model to do exactly that.

If a local model applies this and something's off, the fastest signal is the acceptance checklist in `APPLY.md`: build, protected-route redirect, role denial, token present on your API and absent elsewhere, clean logout. Green on all five means the wiring is right.
