import { Injectable } from '@angular/core';
import { GUITARRERO_KEY_TO_LANE } from '../config/guitarrero-stage.config';
import { GuitarreroLane } from '../models/guitarrero-song.model';

export interface GuitarreroInputBindings {
  onLaneDown: (lane: GuitarreroLane) => void;
  onLaneUp: (lane: GuitarreroLane) => void;
  onPauseToggle?: () => void;
  onBlur?: () => void;
}

@Injectable()
export class GuitarreroInputService {
  private detachListeners: (() => void) | null = null;

  attach(bindings: GuitarreroInputBindings): void {
    this.detach();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.code === 'Space') {
        if (event.repeat) {
          return;
        }

        event.preventDefault();
        bindings.onPauseToggle?.();
        return;
      }

      const lane = GUITARRERO_KEY_TO_LANE[event.key.toLowerCase()];

      if (lane === undefined || event.repeat) {
        return;
      }

      event.preventDefault();
      bindings.onLaneDown(lane);
    };

    const onKeyUp = (event: KeyboardEvent): void => {
      if (event.code === 'Space') {
        event.preventDefault();
        return;
      }

      const lane = GUITARRERO_KEY_TO_LANE[event.key.toLowerCase()];

      if (lane === undefined) {
        return;
      }

      event.preventDefault();
      bindings.onLaneUp(lane);
    };

    const onBlur = (): void => {
      bindings.onBlur?.();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    this.detachListeners = () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }

  detach(): void {
    this.detachListeners?.();
    this.detachListeners = null;
  }
}
