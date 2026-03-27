import { CanvasStageConfig } from './canvas-stage-config.model';

export type GameDevelopmentStatus = 'planned' | 'prototype' | 'published';

export interface GameManifest {
  order: number;
  slug: string;
  title: string;
  summary: string;
  routePath: string;
  status: GameDevelopmentStatus;
  tags: string[];
  assetsBasePath: string;
  canvas: CanvasStageConfig;
  coverImagePath?: string;
}
