import { Routes } from '@angular/router';

export const guitarreroRoutes: Routes = [
  {
    path: 'games/guitarrero',
    loadComponent: () =>
      import('./pages/guitarrero-page/guitarrero-page.component').then(
        (module) => module.GuitarreroPageComponent
      )
  }
];
