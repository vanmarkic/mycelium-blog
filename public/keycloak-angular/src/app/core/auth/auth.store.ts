import {
  Injectable,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import Keycloak from 'keycloak-js'; // instance type + DI token — NOT keycloak-angular
import type { KeycloakProfile } from 'keycloak-js';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';

/**
 * Signal-based auth state.  Inject this anywhere (components, guards, services)
 * and read `authenticated()`, `username()`, `roles()` reactively.  It listens to
 * KEYCLOAK_EVENT_SIGNAL and keeps its signals in sync with the adapter.
 *
 * Zoneless-friendly: it exposes signals, so templates update without Zone.js.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly keycloak = inject(Keycloak);
  private readonly kcEvent = inject(KEYCLOAK_EVENT_SIGNAL); // Signal<KeycloakEvent>

  private readonly _authenticated = signal(false);
  private readonly _profile = signal<KeycloakProfile | null>(null);
  private readonly _roles = signal<string[]>([]);

  readonly authenticated: Signal<boolean> = this._authenticated.asReadonly();
  readonly profile: Signal<KeycloakProfile | null> = this._profile.asReadonly();
  readonly roles: Signal<string[]> = this._roles.asReadonly();
  readonly username = computed(() => this._profile()?.username ?? null);

  constructor() {
    effect(() => {
      const event = this.kcEvent(); // tracked: re-runs on every Keycloak event

      switch (event.type) {
        case KeycloakEventType.Ready: {
          const authed = typeEventArgs<ReadyArgs>(event.args); // boolean
          this.setAuthenticated(authed);
          break;
        }
        case KeycloakEventType.AuthSuccess:
        case KeycloakEventType.AuthRefreshSuccess: {
          this.setAuthenticated(true);
          break;
        }
        case KeycloakEventType.AuthLogout:
        case KeycloakEventType.AuthRefreshError: {
          this.setAuthenticated(false);
          break;
        }
        case KeycloakEventType.TokenExpired: {
          // Belt-and-suspenders: the bearer interceptor also refreshes on demand.
          void this.keycloak.updateToken(30);
          break;
        }
      }
    });
  }

  get token(): string | undefined {
    return this.keycloak.token;
  }

  hasRole(role: string): boolean {
    return this._roles().includes(role);
  }

  login(redirectUri: string = window.location.href): Promise<void> {
    return this.keycloak.login({ redirectUri });
  }

  logout(redirectUri: string = window.location.origin): Promise<void> {
    // keycloak-js maps `redirectUri` to the OIDC post_logout_redirect_uri and
    // attaches id_token_hint automatically (RP-initiated logout).
    return this.keycloak.logout({ redirectUri });
  }

  private setAuthenticated(authed: boolean): void {
    this._authenticated.set(authed);
    if (authed) {
      this.syncRoles();
      void this.refreshProfile();
    } else {
      this._profile.set(null);
      this._roles.set([]);
    }
  }

  private syncRoles(): void {
    const realmRoles = this.keycloak.realmAccess?.roles ?? [];
    const clientId = this.keycloak.clientId;
    const clientRoles = clientId
      ? (this.keycloak.resourceAccess?.[clientId]?.roles ?? [])
      : [];
    this._roles.set([...new Set([...realmRoles, ...clientRoles])]);
  }

  private async refreshProfile(): Promise<void> {
    try {
      this._profile.set(await this.keycloak.loadUserProfile());
    } catch {
      this._profile.set(null);
    }
  }
}
