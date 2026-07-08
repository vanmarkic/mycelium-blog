# 08 — Keycloak server: realm & client checklist

Configure the SPA client in the Keycloak admin console (or via realm import).
This is an OpenID Connect **public** client using **Standard Flow + PKCE S256**.

## Client settings

```
Client ID:                       my-angular-client      (must match environment.ts)
Client type / protocol:          OpenID Connect
Client authentication:           OFF        (public client — no secret; PKCE replaces it)
Standard flow:                   ON         (OAuth 2.0 Authorization Code Flow)
Direct access grants:            OFF        (no password grant in a browser)
Implicit flow:                   OFF        (deprecated; leaks tokens in the URL)
PKCE Code Challenge Method:      S256       (Advanced tab)  + pkceMethod:'S256' in the app
```

## Redirect / origin settings

```
Valid Redirect URIs:
  https://app.myapp.com/*
  https://app.myapp.com/silent-check-sso.html   (covered by the wildcard above too)

Valid Post Logout Redirect URIs:
  https://app.myapp.com/*        (or '+' to inherit the redirect URIs)

Web Origins:
  https://app.myapp.com          (exact origin; or '+' ; NEVER '*')
```

Add `http://localhost:4200/*` and `http://localhost:4200` for local dev, in a
dev realm — do not mix dev origins into a production client.

## Realm session/token settings (starting points, tune to taste)

```
Access Token Lifespan:     ~5 minutes    (short; the refresh token covers gaps)
SSO Session Idle:          ~30 minutes   (refresh-token idle timeout)
SSO Session Max:           ~10 hours     (absolute session cap)
```

## Roles

- **Realm role** (e.g. `admin`): assign to users; checked via `grantedRoles.realmRoles`.
- **Client role** (e.g. `view-books` on `catalog-service`): checked via
  `grantedRoles.resourceRoles['catalog-service']`.
- For client roles to appear in the token, ensure the client's role/audience
  mappers include them (default full-scope clients do).

## Security rules

- **Redirect URIs**: as specific as possible, always HTTPS in production. Broad
  wildcards enable open-redirect / token-leak attacks.
- **Web Origins** sets the CORS `Access-Control-Allow-Origin` for token/userinfo
  calls. `'+'` allows origins already in Valid Redirect URIs; `'*'` allows any
  site — never use `'*'`.
- Only the frontend client needs Web Origins. A server-to-server backend client
  (confidential) does not.
- Consider a client policy profile: `oauth-2-1-for-public-client` or a
  `pkce-enforcer` to enforce S256 server-side.

## Verify

1. Load the app → you are redirected to Keycloak, log in, land back on your app.
2. Anonymous load with `onLoad: 'check-sso'` → app renders, `authenticated()` is false.
3. Call your API → request carries `Authorization: Bearer …`; API validates it.
4. Logout → returned to your app, `authenticated()` is false, no confirm screen.
