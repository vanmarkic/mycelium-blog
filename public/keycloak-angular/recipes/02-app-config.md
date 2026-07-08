# 02 — Bootstrap Keycloak in `app.config.ts`

`provideKeycloak(...)` initialises the adapter before the app renders and
registers the `Keycloak` instance + event signal in DI.

## Step 1: config values in `environment.ts`

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  keycloak: {
    url: 'https://auth.myapp.com', // Keycloak base URL (no trailing /realms)
    realm: 'my-realm',
    clientId: 'my-angular-client',
  },
  apiOrigins: ['https://api.myapp.com'], // hosts allowed to receive the token
};
```

There are no secrets here — a browser SPA is a **public** OAuth client, so
`clientId` is not confidential.

## Step 2: add the providers

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideKeycloak,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  includeBearerTokenInterceptor,
} from 'keycloak-angular';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { bearerTokenConditions } from './core/auth/bearer-token.conditions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeycloak({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso', // silent SSO; 'login-required' to force login first
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.origin + '/',
        pkceMethod: 'S256', // 'S256' | false — there is NO 'plain'
        checkLoginIframe: false, // session iframe needs 3rd-party cookies; off
      },
      features: [
        withAutoRefreshToken({
          sessionTimeout: 300000, // 5 min inactivity
          onInactivityTimeout: 'logout', // 'login' | 'logout' | 'none'
        }),
      ],
      providers: [
        AutoRefreshTokenService, // required by withAutoRefreshToken
        UserActivityService, // required by withAutoRefreshToken
        {
          provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
          useValue: bearerTokenConditions, // array — NOT multi: true
        },
      ],
    }),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideRouter(routes),
  ],
};
```

## Key facts (do not get these wrong)

- `provideKeycloak` returns `EnvironmentProviders`; put it directly in the root providers array.
- Supplying `initOptions` makes it register an app initializer that runs `keycloak.init()`. **Omit `initOptions` only if you want to call `init()` yourself.**
- `withAutoRefreshToken` **requires** `AutoRefreshTokenService` and `UserActivityService` in the nested `providers` array, or it throws at runtime.
- `pkceMethod` is `'S256' | false`. `'plain'` does not exist and will fail type-check.
- `onLoad: 'check-sso'` needs `silentCheckSsoRedirectUri` → see recipe 06.

Next: recipe 03 (the bearer token conditions this file imports).
