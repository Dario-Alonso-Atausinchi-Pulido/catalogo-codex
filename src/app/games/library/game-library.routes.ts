import { Routes } from '@angular/router';

export const gameLibraryRoutes: Routes = [
  {
    path: 'games/demo-runner',
    loadComponent: () =>
      import('./demo-runner/demo-runner-page.component').then(
        (module) => module.DemoRunnerPageComponent
      )
  },
  {
    path: 'games/neon-paddle',
    loadComponent: () =>
      import('./neon-paddle/neon-paddle-page.component').then(
        (module) => module.NeonPaddlePageComponent
      )
  },
  {
    path: 'games/pixel-jump',
    loadComponent: () =>
      import('./pixel-jump/pixel-jump-page.component').then(
        (module) => module.PixelJumpPageComponent
      )
  }
];
