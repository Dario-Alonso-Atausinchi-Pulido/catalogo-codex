import { Component, computed, signal } from '@angular/core';
import { CanvasStageComponent } from '../../engine/components/canvas-stage/canvas-stage.component';
import { PIXEL_JUMP_MANIFEST } from './pixel-jump.manifest';

@Component({
  selector: 'app-pixel-jump-page',
  imports: [CanvasStageComponent],
  templateUrl: './pixel-jump-page.component.html',
  styleUrl: './pixel-jump-page.component.css'
})
export class PixelJumpPageComponent {
  readonly manifest = PIXEL_JUMP_MANIFEST;
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
