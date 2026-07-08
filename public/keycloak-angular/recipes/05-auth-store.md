# 05 — Signal-based `AuthStore`

A single injectable that exposes auth state as signals and keeps them in sync
with Keycloak by listening to `KEYCLOAK_EVENT_SIGNAL`. Zoneless-friendly.

## Step 1: the store

```typescript
// src/app/core/auth/auth.store.ts
import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import Keycloak from 'keycloak-js'; // instance type + DI token — NOT keycloak-angular
import type { KeycloakProfile } from 'keycloak-js';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly keycloak = inject(Keycloak);
  private readonly kcEvent = inject(KEYCLOAK_EVENT_SIGNAL);

  private readonly _authenticated = signal(false);
  private readonly _profile = signal<KeycloakProfile | null>(null);
  private readonly _roles = signal<string[]>([]);

  readonly authenticated: Signal<boolean> = this._authenticated.asReadonly();
  readonly profile: Signal<KeycloakProfile | null> = this._profile.asReadonly();
  readonly roles: Signal<string[]> = this._roles.asReadonly();
  readonly username = computed(() => this._profile()?.username ?? null);

  constructor() {
    effect(() => {
      const event = this.kcEvent(); // re-runs on every Keycloak event
      switch (event.type) {
        case KeycloakEventType.Ready:
          this.setAuthenticated(typeEventArgs<ReadyArgs>(event.args)); // boolean
          break;
        case KeycloakEventType.AuthSuccess:
        case KeycloakEventType.AuthRefreshSuccess:
          this.setAuthenticated(true);
          break;
        case KeycloakEventType.AuthLogout:
        case KeycloakEventType.AuthRefreshError:
          this.setAuthenticated(false);
          break;
        case KeycloakEventType.TokenExpired:
          void this.keycloak.updateToken(30);
          break;
      }
    });
  }

  get token(): string | undefined { return this.keycloak.token; }
  hasRole(role: string): boolean { return this._roles().includes(role); }
  login(redirectUri: string = window.location.href) { return this.keycloak.login({ redirectUri }); }
  logout(redirectUri: string = window.location.origin) { return this.keycloak.logout({ redirectUri }); }

  private setAuthenticated(authed: boolean): void {
    this._authenticated.set(authed);
    if (authed) { this.syncRoles(); void this.refreshProfile(); }
    else { this._profile.set(null); this._roles.set([]); }
  }
  private syncRoles(): void {
    const realm = this.keycloak.realmAccess?.roles ?? [];
    const id = this.keycloak.clientId;
    const client = id ? (this.keycloak.resourceAccess?.[id]?.roles ?? []) : [];
    this._roles.set([...new Set([...realm, ...client])]);
  }
  private async refreshProfile(): Promise<void> {
    try { this._profile.set(await this.keycloak.loadUserProfile()); }
    catch { this._profile.set(null); }
  }
}
```

## Step 2: use it in a component (new control flow)

```typescript
@Component({
  selector: 'app-navbar',
  template: `
    @if (auth.authenticated()) {
      <span>Hello {{ auth.username() }}</span>
      @if (auth.hasRole('admin')) { <a routerLink="/admin">Admin</a> }
      <button (click)="auth.logout()">Logout</button>
    } @else {
      <button (click)="auth.login()">Login</button>
    }
  `,
})
export class NavbarComponent {
  readonly auth = inject(AuthStore);
}
```

## Key facts

- **Import `Keycloak` from `keycloak-js`, not `keycloak-angular`** — the class is not re-exported. `inject(Keycloak)` works because `provideKeycloak` registers the instance in DI.
- `KEYCLOAK_EVENT_SIGNAL` is a `Signal<KeycloakEvent>`; **call it inside `effect()`** to react.
- `KeycloakEventType` members: `Ready`, `AuthSuccess`, `AuthRefreshSuccess`, `AuthLogout`, `AuthError`, `AuthRefreshError`, `TokenExpired`, `ActionUpdate`, `KeycloakAngularInit`, `KeycloakAngularNotInitialized`.
- `typeEventArgs<T>()` is a pure cast (no runtime check) — always `switch` on `event.type` first.
- `AuthLogout` only fires reliably when the session iframe is on. With `checkLoginIframe: false` you mainly get `Ready` / `AuthSuccess` / `AuthRefreshSuccess` / `TokenExpired` — which is why the store also derives state from those.
