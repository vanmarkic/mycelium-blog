import {
  createInterceptorCondition,
  IncludeBearerTokenCondition,
} from 'keycloak-angular';
import { environment } from '../../../environments/environment';

/**
 * SECURITY: the access token is only attached to requests whose URL matches one
 * of these patterns.  Anchor every pattern to an origin you control.  A broad or
 * catch-all pattern leaks your bearer token to third-party hosts.
 *
 * We build one anchored, escaped regex per entry in `environment.apiOrigins`.
 */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function originToPattern(origin: string): RegExp {
  // Matches exactly the origin and any path under it: https://api.myapp.com/...
  return new RegExp(`^(${escapeRegex(origin.replace(/\/$/, ''))})(\\/.*)?$`, 'i');
}

export const bearerTokenConditions = environment.apiOrigins.map((origin) =>
  createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: originToPattern(origin),
    // Optional overrides (defaults shown):
    // bearerPrefix: 'Bearer',
    // authorizationHeaderName: 'Authorization',
    // httpMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }),
);

/*
 * Prefer explicit literals if you don't want the env indirection:
 *
 * export const bearerTokenConditions = [
 *   createInterceptorCondition<IncludeBearerTokenCondition>({
 *     urlPattern: /^(https:\/\/api\.myapp\.com)(\/.*)?$/i,
 *   }),
 * ];
 */
