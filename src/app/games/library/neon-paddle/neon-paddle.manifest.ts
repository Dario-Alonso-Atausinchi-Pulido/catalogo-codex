import { GameManifest } from '../../engine/models/game-manifest.model';

export const NEON_PADDLE_MANIFEST: GameManifest = {
  order: 2,
  slug: 'neon-paddle',
  title: 'Neon Paddle',
  summary: 'Placeholder arcade de rebotes para validar una biblioteca con varias entradas.',
  routePath: '/games/neon-paddle',
  status: 'available',
  tags: ['paddle', 'neon', 'placeholder'],
  assetsBasePath: 'assets/games/neon-paddle',
  canvas: {
    width: 960,
    height: 540
  },
  coverImagePath: 'assets/games/neon-paddle/cover.png',
  coverPlaceholderPath: 'assets/games/neon-paddle/cover-placeholder.svg'
};
