# 07 — Logout & token refresh

## Login / logout

Call through the injected `Keycloak` instance (or via `AuthStore`, recipe 05):

```typescript
private readonly keycloak = inject(Keycloak); // from 'keycloak-js'

login()  { return this.keycloak.login({ redirectUri: window.location.href }); }
logout() { return this.keycloak.logout({ redirectUri: window.location.origin }); }
```

- `logout({ redirectUri })` performs **RP-initiated logout**: keycloak-js maps
  `redirectUri` to the OIDC `post_logout_redirect_uri` and attaches
  `id_token_hint` automatically, so Keycloak skips the "Do you want to log out?"
  confirmation screen and returns the user to your app.
- The `redirectUri` you pass must be listed under the client's **Valid Post
  Logout Redirect URIs** (or `+` to inherit the login redirect URIs). See recipe 08.

## Token refresh — you rarely call this yourself

Two mechanisms already keep the token fresh:

1. **The bearer interceptor** (recipe 03) calls `keycloak.updateToken()` before
   attaching the token, so API requests always send a valid token.
2. **`withAutoRefreshToken`** (recipe 02) refreshes on user activity and logs the
   user out after `sessionTimeout` of inactivity.

If you need a token outside an HTTP call (e.g. for a WebSocket), refresh manually:

```typescript
async getFreshToken(minValiditySeconds = 30): Promise<string | undefined> {
  try {
    await this.keycloak.updateToken(minValiditySeconds); // refreshes if near expiry
    return this.keycloak.token;
  } catch {
    await this.keycloak.login(); // refresh token expired -> re-authenticate
    return undefined;
  }
}
```

## Key facts

- `updateToken(minValidity)` is a no-op if the token still has more than
  `minValidity` seconds left; otherwise it refreshes. On rejection the refresh
  token is dead — send the user to `login()`.
- Do not store tokens in `localStorage`. Keep them in memory (the adapter holds
  them); this pack never persists tokens.
- Access-token lifespan and SSO session idle/max are realm settings (recipe 08),
  not app config.
