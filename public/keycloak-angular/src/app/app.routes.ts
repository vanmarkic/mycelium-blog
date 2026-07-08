import { Routes } from '@angular/router';
import { canActivateAuthRole } from './core/auth/auth-role.guard';

/**
 * Wiring the role guard.  `data` declares the requirement; the guard reads it.
 * Replace the component references with your own.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./features/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent,
      ),
  },
  {
    // Any authenticated user (no role requirement).
    path: 'account',
    canActivate: [canActivateAuthRole],
    loadComponent: () =>
      import('./features/account/account.component').then(
        (m) => m.AccountComponent,
      ),
  },
  {
    // Requires realm role 'admin'.
    path: 'admin',
    canActivate: [canActivateAuthRole],
    data: { realmRole: 'admin' },
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    // Requires client role 'view-books' on client 'catalog-service'.
    path: 'books',
    canActivate: [canActivateAuthRole],
    data: { clientRole: 'view-books', client: 'catalog-service' },
    loadComponent: () =>
      import('./features/books/books.component').then((m) => m.BooksComponent),
  },
];
