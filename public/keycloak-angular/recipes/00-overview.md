# 00 — Overview: Keycloak in Angular 21 (best practices, mid-2026)

Goal: add Keycloak login, route protection, and authenticated API calls to an
existing **Angular 21** app (standalone, signals, zoneless) using
**keycloak-angular** + **keycloak-js**, following 2026 security best practices.

## Versions to pin (July 2026)

| Package | Version | Why |
|---|---|---|
| `keycloak-angular` | `^21` | Its major must match your Angular major. Angular 21 → keycloak-angular 21. (Latest overall is 22, for Angular 22.) |
| `keycloak-js` | `^26` | Peer dependency. Latest is 26.2.x. |
| Keycloak server | 26.x | Any 26.x realm works; server version is decoupled from `keycloak-js`. |

Rule: **keycloak-angular's major version tracks Angular's major.** On Angular 20 use `keycloak-angular@20`; on 22 use `@22`. Do not install `latest` blindly.

## The default decisions (all applied by this pack)

- **Authorization Code flow + PKCE `S256`.** Never implicit flow.
- **Public client**, no client secret (a browser cannot keep one).
- **Silent SSO** (`onLoad: 'check-sso'`) so anonymous users can still load the app; switch to `'login-required'` to force login first.
- **URL-scoped bearer token** — the token is attached only to your own API origins, never to third parties.
- **Signal-based auth state** via `KEYCLOAK_EVENT_SIGNAL` (zoneless-friendly).
- **Functional guards & interceptors** (`createAuthGuard`, `includeBearerTokenInterceptor`) — no NgModules, no class guards.
- **Auto token refresh** with inactivity logout (`withAutoRefreshToken`).

## The mental model

1. `provideKeycloak(...)` in `app.config.ts` boots the adapter before the app renders and registers the `Keycloak` instance + an event `Signal` in DI.
2. Components/services read auth state from a signal-based `AuthStore`.
3. Route guards call `createAuthGuard` and check roles from route `data`.
4. The HTTP interceptor adds `Authorization: Bearer <token>` — but only for URLs you allow-list.
5. Keycloak (the server) must be configured as a public Standard-Flow client with correct redirect URIs and web origins.

## Apply order

Read `APPLY.md`, then the recipes in order: `01` → `08`. Recipes `09` (testing) and `10` (gotchas) are reference. Each recipe is self-contained; load only what you need.
