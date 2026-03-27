import { CanvasStageConfig } from './canvas-stage-config.model';

export interface CanvasGame {
  readonly id: string;
  readonly config: CanvasStageConfig;
  setup?(context: CanvasRenderingContext2D): void;
  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D): void;
  resize?(config: CanvasStageConfig): void;
  destroy?(): void;
}
