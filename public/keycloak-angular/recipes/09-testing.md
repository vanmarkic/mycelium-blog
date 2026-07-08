# 09 — Testing components that use auth (Angular 21 + Vitest)

Angular 21's default test runner is **Vitest**, driven through the Angular build
(`ng test`). Do not run `vitest run` directly — it bypasses Angular's compiler.
The trick for auth: never boot the real Keycloak adapter in a unit test. Provide
fakes for the two DI tokens the code depends on — `Keycloak` and, if you touch the
store, `KEYCLOAK_EVENT_SIGNAL`.

## Fake the `AuthStore` (simplest)

Most components only need `AuthStore`. Provide a stub:

```typescript
import { signal } from '@angular/core';
import { AuthStore } from './core/auth/auth.store';

const fakeAuth: Partial<AuthStore> = {
  authenticated: signal(true),
  username: signal('alice') as any,
  roles: signal(['admin']),
  hasRole: (r: string) => r === 'admin',
  login: async () => {},
  logout: async () => {},
};

TestBed.configureTestingModule({
  providers: [{ provide: AuthStore, useValue: fakeAuth }],
});
```

## Fake `Keycloak` directly (for the store / guard)

```typescript
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { signal } from '@angular/core';

const fakeKeycloak = {
  token: 'fake.jwt.token',
  clientId: 'my-angular-client',
  realmAccess: { roles: ['admin'] },
  resourceAccess: { 'my-angular-client': { roles: ['view-books'] } },
  login: async () => {},
  logout: async () => {},
  updateToken: async () => true,
  loadUserProfile: async () => ({ username: 'alice' }),
} as unknown as Keycloak;

const eventSignal = signal({ type: KeycloakEventType.Ready, args: true });

TestBed.configureTestingModule({
  providers: [
    { provide: Keycloak, useValue: fakeKeycloak },
    { provide: KEYCLOAK_EVENT_SIGNAL, useValue: eventSignal },
  ],
});
```

Drive state by setting `eventSignal.set({ type: KeycloakEventType.AuthLogout })`
and asserting the store's signals update.

## Key facts

- Provide `Keycloak` (from `keycloak-js`) and `KEYCLOAK_EVENT_SIGNAL` (from
  `keycloak-angular`) as values; never call `provideKeycloak()` in a unit test.
- Run via `ng test` so external `templateUrl`/`styleUrls` resolve correctly.
- Guards run in an injection context — test them with
  `TestBed.runInInjectionContext(() => canActivateAuthRole(route, state))`.
