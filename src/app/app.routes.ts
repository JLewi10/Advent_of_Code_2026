import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'day/:dayNumber',
    loadComponent: () => import('./features/day/day').then((m) => m.Day),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found').then((m) => m.PageNotFound),
  },
];
