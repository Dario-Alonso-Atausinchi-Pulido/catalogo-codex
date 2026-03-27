import { Component, computed, signal } from '@angular/core';
import { CanvasStageComponent } from '../../engine/components/canvas-stage/canvas-stage.component';
import { DEMO_RUNNER_MANIFEST } from './demo-runner.manifest';

@Component({
  selector: 'app-demo-runner-page',
  imports: [CanvasStageComponent],
  templateUrl: './demo-runner-page.component.html',
  styleUrl: './demo-runner-page.component.css'
})
export class DemoRunnerPageComponent {
  readonly manifest = DEMO_RUNNER_MANIFEST;
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
