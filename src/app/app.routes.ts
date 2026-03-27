import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/shell/app-shell.component';
import { gameLibraryRoutes } from './games/library/game-library.routes';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'catalog'
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./catalog/pages/catalog-page/catalog-page.component').then(
            (module) => module.CatalogPageComponent
          )
      },
      ...gameLibraryRoutes,
      {
        path: '**',
        redirectTo: 'catalog'
      }
    ]
  }
];
