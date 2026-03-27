import { CanvasStageConfig } from './canvas-stage-config.model';

export type GameAvailabilityStatus = 'available' | 'coming-soon' | 'locked';

export interface GameManifest {
  order: number;
  slug: string;
  title: string;
  summary: string;
  routePath: string;
  status: GameAvailabilityStatus;
  tags: string[];
  assetsBasePath: string;
  canvas: CanvasStageConfig;
  coverImagePath?: string;
  coverPlaceholderPath?: string;
}
