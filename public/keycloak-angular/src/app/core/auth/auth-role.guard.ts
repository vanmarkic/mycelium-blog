import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

/**
 * Route protection with role checks.  Declare requirements on the route:
 *   { path: 'admin', canActivate: [canActivateAuthRole], data: { realmRole: 'admin' } }
 *   { path: 'books', canActivate: [canActivateAuthRole],
 *     data: { clientRole: 'view-books', client: 'catalog-service' } }
 */
const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData,
): Promise<boolean | UrlTree> => {
  // GOTCHA: inject() needs a synchronous injection context, which is lost after
  // the first `await`.  Capture every DI reference BEFORE awaiting.
  const router = inject(Router);

  const { authenticated, grantedRoles, keycloak } = authData;

  // (a) Not logged in -> send to Keycloak, come back to the attempted URL.
  if (!authenticated) {
    await keycloak.login({ redirectUri: window.location.origin + state.url });
    return false; // navigation to Keycloak is under way
  }

  // (b) Enforce role(s) declared on the route. Authenticated is enough if none.
  const requiredRealmRole = route.data['realmRole'] as string | undefined;
  const requiredClientRole = route.data['clientRole'] as string | undefined;
  const requiredClient = route.data['client'] as string | undefined;

  if (!requiredRealmRole && !requiredClientRole) {
    return true;
  }

  const hasRealmRole = (r: string): boolean =>
    grantedRoles.realmRoles.includes(r);

  const hasClientRole = (r: string, client?: string): boolean =>
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

// For child routes use:
//   createAuthGuard<CanActivateChildFn>(isAccessAllowed) with canActivateChild.
