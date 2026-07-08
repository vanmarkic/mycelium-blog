# 10 — Gotchas & common mistakes

The mistakes below are the ones that actually break builds or leak credentials.
Each is a correction verified against `keycloak-angular@21` / `keycloak-js@26`.

1. **Import `Keycloak` from `keycloak-js`, not `keycloak-angular`.**
   `keycloak-angular` does not re-export the `Keycloak` class. Use
   `import Keycloak from 'keycloak-js';`. `inject(Keycloak)` still works because
   `provideKeycloak` registers the instance in DI.

2. **`pkceMethod` is `'S256' | false`.** There is no `'plain'`. `'S256'` is the
   default; set it explicitly anyway.

3. **`INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG` is a single token holding an
   array.** Provide it with `useValue: [ ...conditions ]`. Do **not** add
   `multi: true` — it is not a multi-provider.

4. **Scope the bearer token.** An unanchored `urlPattern` sends your access token
   to every host you call. Anchor each pattern to an origin you own; add hosts as
   separate conditions.

5. **`inject()` before `await` in async guards.** Angular's injection context is
   synchronous. Capture `inject(Router)` (and any DI) at the top of the guard,
   before the first `await`, or it throws at runtime.

6. **`withAutoRefreshToken` needs its services.** Add `AutoRefreshTokenService`
   and `UserActivityService` to the nested `providers` array, or it fails at
   runtime.

7. **`silent-check-sso.html` must be at the web root and allow-listed.** Serve it
   from `public/` and add its URL to the client's Valid Redirect URIs, or silent
   SSO silently fails and every user looks anonymous.

8. **`checkLoginIframe` and third-party cookies.** The session-status iframe
   needs third-party cookies, which modern browsers block. Set
   `checkLoginIframe: false` and rely on token refresh. Consequence: the
   `AuthLogout` event fires less reliably, so derive auth state from `Ready` /
   `AuthSuccess` / `AuthRefreshSuccess` too (the `AuthStore` already does).

9. **Pin the matching major.** `keycloak-angular`'s major tracks Angular's major.
   Installing `latest` on Angular 21 pulls v22 (for Angular 22) and produces peer
   warnings / subtle breakage. Use `keycloak-angular@^21`.

10. **The legacy API is deprecated, not removed.** `KeycloakService`,
    `KeycloakAngularModule`, `KeycloakBearerInterceptor`, and `KeycloakAuthGuard`
    still exist for backward compatibility but are deprecated since v19. Do not
    build new code on them — use `provideKeycloak`, `includeBearerTokenInterceptor`,
    and `createAuthGuard`.

11. **Guards and interceptors are UX, not security.** They hide UI and add
    convenience. The API server must independently validate the token and enforce
    roles. A determined user can bypass any client-side check.

12. **Don't persist tokens.** Keep them in memory (the adapter holds them). Do not
    copy tokens into `localStorage`/`sessionStorage`.
