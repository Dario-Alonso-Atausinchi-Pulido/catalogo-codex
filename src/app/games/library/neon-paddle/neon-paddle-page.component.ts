import { Component, computed, signal } from '@angular/core';
import { CanvasStageComponent } from '../../engine/components/canvas-stage/canvas-stage.component';
import { NEON_PADDLE_MANIFEST } from './neon-paddle.manifest';

@Component({
  selector: 'app-neon-paddle-page',
  imports: [CanvasStageComponent],
  templateUrl: './neon-paddle-page.component.html',
  styleUrl: './neon-paddle-page.component.css'
})
export class NeonPaddlePageComponent {
  readonly manifest = NEON_PADDLE_MANIFEST;
  readonly coverLoadFailed = signal(false);
  readonly coverImagePath = computed(() => {
    if (this.coverLoadFailed()) {
      return this.manifest.coverPlaceholderPath ?? '';
    }

    return this.manifest.coverImagePath ?? this.manifest.coverPlaceholderPath ?? '';
  });

  onCoverError(): void {
    this.coverLoadFailed.set(true);
  }
}
