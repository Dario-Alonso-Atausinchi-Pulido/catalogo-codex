import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GameAvailabilityStatus,
  GameManifest
} from '../../../games/engine/models/game-manifest.model';

const STATUS_META: Record<
  GameAvailabilityStatus,
  { label: string; actionLabel: string; tone: GameAvailabilityStatus }
> = {
  available: {
    label: 'Disponible',
    actionLabel: 'Entrar',
    tone: 'available'
  },
  'coming-soon': {
    label: 'Proximamente',
    actionLabel: 'Pronto',
    tone: 'coming-soon'
  },
  locked: {
    label: 'Bloqueado',
    actionLabel: 'Cerrado',
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

  isAvailable(): boolean {
    return this.game().status === 'available';
  }

  onCoverError(): void {
    this.coverLoadFailed.set(true);
  }
}
