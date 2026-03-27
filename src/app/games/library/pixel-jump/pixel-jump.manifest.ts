import { GameManifest } from '../../engine/models/game-manifest.model';

export const PIXEL_JUMP_MANIFEST: GameManifest = {
  order: 3,
  slug: 'pixel-jump',
  title: 'Pixel Jump',
  summary: 'Placeholder de salto para comprobar espaciado, ritmo visual y escalado del catalogo.',
  routePath: '/games/pixel-jump',
  status: 'available',
  tags: ['jump', 'pixel', 'placeholder'],
  assetsBasePath: 'assets/games/pixel-jump',
  canvas: {
    width: 960,
    height: 540
  },
  coverImagePath: 'assets/games/pixel-jump/cover.png',
  coverPlaceholderPath: 'assets/games/pixel-jump/cover-placeholder.svg'
};
