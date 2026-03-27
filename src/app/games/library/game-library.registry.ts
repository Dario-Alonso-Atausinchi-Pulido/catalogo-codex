import { GameManifest } from '../engine/models/game-manifest.model';
import { DEMO_RUNNER_MANIFEST } from './demo-runner/demo-runner.manifest';
import { NEON_PADDLE_MANIFEST } from './neon-paddle/neon-paddle.manifest';
import { PIXEL_JUMP_MANIFEST } from './pixel-jump/pixel-jump.manifest';

export const GAME_LIBRARY_REGISTRY: ReadonlyArray<GameManifest> = [
  DEMO_RUNNER_MANIFEST,
  NEON_PADDLE_MANIFEST,
  PIXEL_JUMP_MANIFEST
];
