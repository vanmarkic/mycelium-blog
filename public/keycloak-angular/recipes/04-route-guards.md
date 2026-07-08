# 04 — Route guards with role checks

Use `createAuthGuard` to build a functional `CanActivateFn`. Your callback
receives `AuthGuardData` = `{ authenticated, grantedRoles, keycloak }`.

## Step 1: the guard

```typescript
// src/app/core/auth/auth-role.guard.ts
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData,
): Promise<boolean | UrlTree> => {
  // GOTCHA: capture DI refs BEFORE the first await (injection context is sync).
  const router = inject(Router);
  const { authenticated, grantedRoles, keycloak } = authData;

  if (!authenticated) {
    await keycloak.login({ redirectUri: window.location.origin + state.url });
    return false;
  }

  const requiredRealmRole = route.data['realmRole'] as string | undefined;
  const requiredClientRole = route.data['clientRole'] as string | undefined;
  const requiredClient = route.data['client'] as string | undefined;

  if (!requiredRealmRole && !requiredClientRole) return true;

  const hasRealmRole = (r: string) => grantedRoles.realmRoles.includes(r);
  const hasClientRole = (r: string, client?: string) =>
    client
      ? (grantedRoles.resourceRoles[client]?.includes(r) ?? false)
      : Object.values(grantedRoles.resourceRoles).some((roles) =>
          roles.includes(r),
        );

  const allowed =
    (requiredRealmRole ? hasRealmRole(requiredRealmRole) : false) ||
    (requiredClientRole
      ? hasClientRole(requiredClientRole, requiredClient)
      : false);

  return allowed ? true : router.parseUrl('/forbidden');
};

export const canActivateAuthRole =
  createAuthGuard<CanActivateFn>(isAccessAllowed);
```

## Step 2: wire onto routes

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { canActivateAuthRole } from './core/auth/auth-role.guard';

export const routes: Routes = [
  { path: 'account', canActivate: [canActivateAuthRole], /* any authed user */
    loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent) },
  { path: 'admin', canActivate: [canActivateAuthRole], data: { realmRole: 'admin' },
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) },
  { path: 'books', canActivate: [canActivateAuthRole],
    data: { clientRole: 'view-books', client: 'catalog-service' },
    loadComponent: () => import('./features/books/books.component').then(m => m.BooksComponent) },
  { path: 'forbidden',
    loadComponent: () => import('./features/forbidden/forbidden.component').then(m => m.ForbiddenComponent) },
];
```

## Key facts

- `AuthGuardData.grantedRoles` is `{ realmRoles: string[]; resourceRoles: { [clientId]: string[] } }`.
- The callback is **always async** (`Promise<boolean | UrlTree>`).
- **Capture `inject(Router)` (and any DI) before the first `await`** — after an `await` the injection context is gone and `inject()` throws.
- For child routes: `createAuthGuard<CanActivateChildFn>(isAccessAllowed)` + `canActivateChild`.
- The class-based `KeycloakAuthGuard` is deprecated. Use `createAuthGuard`.
- Route guards are defence-in-depth for UX; the **API must still enforce roles server-side**. A guard only hides UI.
