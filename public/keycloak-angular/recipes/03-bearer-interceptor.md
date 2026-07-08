# 03 — Bearer token interceptor (URL-scoped)

The functional interceptor `includeBearerTokenInterceptor` attaches
`Authorization: Bearer <token>` to outgoing requests — **but only** for URLs that
match a condition you provide. It also refreshes the token before attaching it.

## SECURITY: scope the token to your own origins

A bearer token is a credential. If your interceptor matches every URL, the token
is sent to any host you call — analytics, CDNs, third-party APIs — which leaks it.
**Anchor every `urlPattern` to an origin you control.**

## Step 1: define the conditions

```typescript
// src/app/core/auth/bearer-token.conditions.ts
import {
  createInterceptorCondition,
  IncludeBearerTokenCondition,
} from 'keycloak-angular';
import { environment } from '../../../environments/environment';

function escapeRegex(v: string): string {
  return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function originToPattern(origin: string): RegExp {
  return new RegExp(`^(${escapeRegex(origin.replace(/\/$/, ''))})(\\/.*)?$`, 'i');
}

export const bearerTokenConditions = environment.apiOrigins.map((origin) =>
  createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: originToPattern(origin),
  }),
);
```

Prefer explicit literals instead of the env indirection:

```typescript
export const bearerTokenConditions = [
  createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /^(https:\/\/api\.myapp\.com)(\/.*)?$/i,
    // Optional: bearerPrefix: 'Bearer', authorizationHeaderName: 'Authorization',
    // httpMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }),
];
```

## Step 2: register (done in app.config.ts, recipe 02)

```typescript
// providers:
{ provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: bearerTokenConditions },
// and:
provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
```

## Key facts

- `INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG` is a **single** `InjectionToken<IncludeBearerTokenCondition[]>`. Provide it with `useValue: [ ...conditions ]`. It is **not** a `multi: true` provider.
- `urlPattern` is **required** on every condition.
- Add more API hosts as **separate conditions**, not by widening one pattern.
- Register `includeBearerTokenInterceptor` exactly once inside `withInterceptors([...])`.
- The interceptor calls `keycloak.updateToken()` internally, so a near-expiry token is refreshed before the request goes out. You do not need a manual refresh in each service.

## Verify

Make an authenticated request to your API and confirm the `Authorization` header
is present; make a request to a third-party URL and confirm it is **absent**.
