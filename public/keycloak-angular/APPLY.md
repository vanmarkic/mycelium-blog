# APPLY.md — ordered steps for a coding agent

You are adding Keycloak authentication to an existing **Angular 21** app.
Follow these steps in order. Each references a self-contained recipe. Do not skip
the verification at the end of each step.

## Preconditions
- The project is Angular 21 (standalone bootstrap via `bootstrapApplication` and
  an `ApplicationConfig` in `src/app/app.config.ts`). If it still uses NgModules,
  migrate the bootstrap first.
- You know the Keycloak `url`, `realm`, and `clientId` to target. If not, ask.

## Steps
1. **Install.** `npm install keycloak-angular@^21 keycloak-js@^26`. (Match the
   major to the app's Angular major if not 21.) — recipe `01`.
2. **Config values.** Add `keycloak` + `apiOrigins` to `src/environments/environment.ts`. — recipe `02`.
3. **Bearer conditions.** Create `src/app/core/auth/bearer-token.conditions.ts`,
   anchored to `apiOrigins` only. — recipe `03`.
4. **Bootstrap.** Add `provideKeycloak(...)`, `provideHttpClient(withInterceptors([includeBearerTokenInterceptor]))`,
   and the interceptor-config provider to `src/app/app.config.ts`. — recipe `02`.
5. **Guard.** Create `src/app/core/auth/auth-role.guard.ts` and wire
   `canActivateAuthRole` onto protected routes in `app.routes.ts`. — recipe `04`.
6. **Auth state.** Create `src/app/core/auth/auth.store.ts`; use its signals in
   the navbar / components. — recipe `05`.
7. **Silent SSO.** Create `public/silent-check-sso.html`. — recipe `06`.
8. **Keycloak server.** Configure the client (Standard Flow + PKCE S256, public,
   redirect URIs, web origins, post-logout URIs). — recipe `08`.

## Acceptance checklist (verify all)
- [ ] `ng build` succeeds with no type errors.
- [ ] Loading a protected route while logged out redirects to Keycloak and returns to the attempted URL after login.
- [ ] A user without the required role is sent to `/forbidden`.
- [ ] Requests to an `apiOrigins` host carry `Authorization: Bearer <token>`.
- [ ] Requests to any other host do **not** carry the token.
- [ ] `AuthStore.authenticated()` / `username()` / `roles()` reflect the logged-in user.
- [ ] Logout returns to the app with no Keycloak confirmation screen.
- [ ] `public/silent-check-sso.html` is present in the build output and its URL is a Valid Redirect URI.
- [ ] `keycloak-angular` major matches the app's Angular major.

## Non-negotiable rules
- Never widen a bearer `urlPattern` to match hosts you don't own.
- Never use implicit flow or a client secret in the browser.
- `inject()` before the first `await` in the guard.
- Import `Keycloak` from `keycloak-js`.
- Treat all guards/interceptors as UX only; the API enforces auth server-side.

See `recipes/10-gotchas.md` for the full list of traps.
