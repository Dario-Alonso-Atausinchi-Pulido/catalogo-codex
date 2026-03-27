import { Injectable } from '@angular/core';
import { GUITARRERO_AUDIO_CONFIG } from '../config/guitarrero-stage.config';

@Injectable()
export class GuitarreroAudioService {
  private audio: HTMLAudioElement | null = null;
  private restoreTimeoutId: number | null = null;

  async start(source: string): Promise<void> {
    this.stop();

    const audio = new Audio(source);
    audio.loop = false;
    audio.preload = 'auto';
    audio.volume = GUITARRERO_AUDIO_CONFIG.baseVolume;

    this.audio = audio;

    try {
      await audio.play();
    } catch {
      // Si el navegador bloquea autoplay, el juego sigue siendo jugable sin romper el flujo.
    }
  }

  punishMiss(): void {
    if (!this.audio) {
      return;
    }

    this.audio.volume = GUITARRERO_AUDIO_CONFIG.missVolume;

    if (this.restoreTimeoutId !== null) {
      window.clearTimeout(this.restoreTimeoutId);
    }

    this.restoreTimeoutId = window.setTimeout(() => {
      if (this.audio) {
        this.audio.volume = GUITARRERO_AUDIO_CONFIG.baseVolume;
      }

      this.restoreTimeoutId = null;
    }, GUITARRERO_AUDIO_CONFIG.duckDurationMs);
  }

  pause(): void {
    if (!this.audio) {
      return;
    }

    this.audio.pause();
  }

  async resume(): Promise<void> {
    if (!this.audio) {
      return;
    }

    try {
      await this.audio.play();
    } catch {
      // Si el navegador bloquea la reanudacion, evitamos romper el juego.
    }
  }

  stop(): void {
    if (this.restoreTimeoutId !== null) {
      window.clearTimeout(this.restoreTimeoutId);
      this.restoreTimeoutId = null;
    }

    if (!this.audio) {
      return;
    }

    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.volume = GUITARRERO_AUDIO_CONFIG.baseVolume;
    this.audio = null;
  }
}
