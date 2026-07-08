# 01 — Install & files to create

## Step 1: install (pin to your Angular major)

```bash
# Angular 21:
npm install keycloak-angular@^21 keycloak-js@^26
```

If your app is on a different Angular major, match it: `keycloak-angular@20` for
Angular 20, `@22` for Angular 22. Both packages come from npm; the old
server-bundled `keycloak.js` adapter (served from `/auth/js/keycloak.js`) is
deprecated — do not use it.

## Step 2: files you will create or edit

| File | Action | Recipe |
|---|---|---|
| `src/environments/environment.ts` | add `keycloak` + `apiOrigins` | 02 |
| `src/app/core/auth/bearer-token.conditions.ts` | new | 03 |
| `src/app/app.config.ts` | add providers | 02, 03 |
| `src/app/core/auth/auth-role.guard.ts` | new | 04 |
| `src/app/app.routes.ts` | wire guard onto routes | 04 |
| `src/app/core/auth/auth.store.ts` | new | 05 |
| `public/silent-check-sso.html` | new (static asset) | 06 |

Ready-made versions of every file live under this pack's `src/` folder — copy
them and change the `environment.ts` values. Paths above assume a standard
`ng new` layout; adjust to your project structure.

## Step 3: confirm `public/` is served at the web root

`silent-check-sso.html` must be reachable at `https://<your-app>/silent-check-sso.html`.
In Angular 21 anything in the `public/` folder is copied to the site root at
build time. Verify `public/` is listed under `assets`/`public` in `angular.json`
(the default `ng new` config already does this).

## Step 4: verify it compiles

```bash
ng build
```

Then continue with recipe 02.
