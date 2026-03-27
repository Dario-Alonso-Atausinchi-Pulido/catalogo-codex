import { GameManifest } from '../../engine/models/game-manifest.model';

export const DEMO_RUNNER_MANIFEST: GameManifest = {
  order: 1,
  slug: 'demo-runner',
  title: 'Demo Runner',
  summary: 'Primer modulo placeholder para validar el flujo completo entre catalogo, card y vista de juego.',
  routePath: '/games/demo-runner',
  status: 'available',
  tags: ['demo', 'placeholder', 'arcade'],
  assetsBasePath: 'assets/games/demo-runner',
  canvas: {
    width: 960,
    height: 540
  },
  coverImagePath: 'assets/games/demo-runner/cover.png',
  coverPlaceholderPath: 'assets/games/demo-runner/cover-placeholder.svg'
};
