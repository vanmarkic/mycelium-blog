# 06 — `silent-check-sso.html`

`onLoad: 'check-sso'` checks the SSO session silently inside a hidden iframe
instead of a full-page redirect. That iframe loads a tiny static page on your own
origin whose only job is to hand the result URL back to the app.

## Step 1: create the file

```html
<!-- public/silent-check-sso.html -->
<!doctype html>
<html>
  <body>
    <script>
      parent.postMessage(location.href, location.origin);
    </script>
  </body>
</html>
```

## Step 2: it must be served at the web root

The URL you passed as `silentCheckSsoRedirectUri` in `app.config.ts` is
`window.location.origin + '/silent-check-sso.html'`, so the file must resolve at
`https://<your-app>/silent-check-sso.html`.

In Angular 21 the `public/` folder is copied to the site root at build time — put
the file there. Verify after `ng build` that `dist/<app>/browser/silent-check-sso.html`
exists.

## Step 3: allow-list its URL on the Keycloak client

Add `https://<your-app>/silent-check-sso.html` to the client's **Valid Redirect
URIs** (a wildcard like `https://<your-app>/*` also covers it). If it is missing,
silent SSO fails and the user is treated as anonymous. See recipe 08.

## Key facts

- The file is intentionally trivial — do not add anything else to it.
- `checkLoginIframe: false` (set in recipe 02) disables the separate periodic
  *session-status* iframe, which is different from this one-shot silent-SSO
  check. The silent-SSO check still runs at startup.
- Silent SSO depends on third-party-cookie policy. In browsers with strict cookie
  settings (Safari, hardened Chrome) it may fall back to treating the user as
  logged out; `silentCheckSsoFallback` (default `true`) handles that. It is a
  best-effort optimisation, not a guarantee.
