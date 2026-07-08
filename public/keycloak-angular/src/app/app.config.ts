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
      // Supplying initOptions makes provideKeycloak register an app initializer
      // that calls keycloak.init() before the app renders.  Omit initOptions to
      // control init() yourself.
      initOptions: {
        // 'check-sso' = silent SSO; the app loads for anonymous users too.
        // Use 'login-required' to force a login redirect before anything renders.
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.origin + '/',
        pkceMethod: 'S256', // 'S256' | false  — there is NO 'plain' value
        // The session-status iframe needs third-party cookies, which modern
        // browsers block.  Disable it and rely on token refresh instead.
        checkLoginIframe: false,
      },
      features: [
        // Refresh the token on activity; log the user out after inactivity.
        withAutoRefreshToken({
          sessionTimeout: 300000, // 5 min of inactivity
          onInactivityTimeout: 'logout', // 'login' | 'logout' | 'none'
        }),
      ],
      providers: [
        AutoRefreshTokenService, // required by withAutoRefreshToken
        UserActivityService, // required by withAutoRefreshToken
        {
          // Single InjectionToken holding the array of URL conditions.
          // useValue with an array — NOT a multi-provider.
          provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
          useValue: bearerTokenConditions,
        },
      ],
    }),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideRouter(routes),
  ],
};
