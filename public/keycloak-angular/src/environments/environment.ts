/**
 * Angular environment config.  Keep Keycloak connection details here (or in a
 * runtime-loaded config for multi-tenant deploys) — never hard-code them inside
 * components.  `apiOrigins` lists the hosts that are allowed to receive the
 * access token (see bearer-token.conditions.ts).
 *
 * Angular 21 uses a `src/environments/` file per build target and swaps them via
 * `fileReplacements` in angular.json.  There are no secrets here: a browser SPA
 * is a PUBLIC OAuth client, so `clientId` is not confidential.
 */
export const environment = {
  production: false,
  keycloak: {
    url: 'https://auth.myapp.com', // Keycloak base URL (no trailing /realms)
    realm: 'my-realm',
    clientId: 'my-angular-client',
  },
  // Every origin your app calls that must carry the bearer token.
  // Anything NOT listed here is called WITHOUT the token (correct for 3rd parties).
  apiOrigins: ['https://api.myapp.com'],
};
