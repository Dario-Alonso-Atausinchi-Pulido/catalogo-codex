import { GameManifest } from '../../engine/models/game-manifest.model';
import { GUITARRERO_STAGE_CONFIG } from './config/guitarrero-stage.config';

export const GUITARRERO_MANIFEST: GameManifest = {
  order: 10,
  slug: 'guitarrero',
  title: 'GUITARRERO',
  subtitle: 'Duro como una piedra',
  summary: 'juego ritmico arcade de cuatro carriles con castigo musical por errores',
  routePath: '/games/guitarrero',
  status: 'available',
  tags: ['rhythm'],
  assetsBasePath: 'assets/games/guitarrero',
  canvas: GUITARRERO_STAGE_CONFIG,
  coverImagePath: 'assets/games/guitarrero/cover.png',
  coverPlaceholderPath: 'assets/games/guitarrero/cover-placeholder.svg'
};
