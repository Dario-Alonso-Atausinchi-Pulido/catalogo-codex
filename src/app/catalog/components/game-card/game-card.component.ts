import { Component, computed, effect, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GameAvailabilityStatus,
  GameManifest
} from '../../../games/engine/models/game-manifest.model';

const STATUS_META: Record<
  GameAvailabilityStatus,
  { label: string; tone: GameAvailabilityStatus }
> = {
  available: {
    label: 'Disponible',
    tone: 'available'
  },
  'coming-soon': {
    label: 'Proximamente',
    tone: 'coming-soon'
  },
  locked: {
    label: 'Bloqueado',
    tone: 'locked'
  }
};

@Component({
  selector: 'app-game-card',
  imports: [RouterLink],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css'
})
export class GameCardComponent {
  readonly game = input.required<GameManifest>();
  readonly coverLoadFailed = signal(false);
  readonly statusMeta = computed(() => STATUS_META[this.game().status]);
  readonly resolvedCoverPath = computed(() => {
    if (this.coverLoadFailed()) {
      return this.game().coverPlaceholderPath ?? '';
    }

    return this.game().coverImagePath ?? this.game().coverPlaceholderPath ?? '';
  });
  readonly hasCover = computed(() => Boolean(this.resolvedCoverPath()));

  constructor() {
    effect(() => {
      this.game().coverImagePath;
      this.game().coverPlaceholderPath;
      this.coverLoadFailed.set(false);
    });
  }

  isAvailable(): boolean {
    return this.game().status === 'available';
  }

  onCoverError(): void {
    this.coverLoadFailed.set(true);
  }
}
