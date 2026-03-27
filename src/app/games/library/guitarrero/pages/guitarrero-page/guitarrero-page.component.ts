import { ElementRef, ViewChild, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GUITARRERO_LANE_COUNT,
  GUITARRERO_LANE_KEYS,
  GUITARRERO_MOOD_META,
  GUITARRERO_STAGE_CONFIG
} from '../../config/guitarrero-stage.config';
import { GUITARRERO_SONGS } from '../../config/guitarrero-songs.config';
import { GUITARRERO_MANIFEST } from '../../guitarrero.manifest';
import {
  GuitarreroResultState,
  GuitarreroSceneSnapshot
} from '../../models/guitarrero-runtime-state.model';
import { GuitarreroSong } from '../../models/guitarrero-song.model';
import { GuitarreroGameScene } from '../../scenes/guitarrero-game.scene';
import { GuitarreroRendererScene } from '../../scenes/guitarrero-renderer.scene';
import { GuitarreroAudioService } from '../../services/guitarrero-audio.service';
import { GuitarreroInputService } from '../../services/guitarrero-input.service';

type GuitarreroScreen = 'menu' | 'playing' | 'results';

@Component({
  selector: 'app-guitarrero-page',
  imports: [RouterLink],
  templateUrl: './guitarrero-page.component.html',
  styleUrl: './guitarrero-page.component.css',
  providers: [GuitarreroInputService, GuitarreroAudioService]
})
export class GuitarreroPageComponent {
  private readonly inputService = inject(GuitarreroInputService);
  private readonly audioService = inject(GuitarreroAudioService);
  private readonly renderer = new GuitarreroRendererScene();

  private scene: GuitarreroGameScene | null = null;
  private canvasContext: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private playScreenElement: HTMLElement | null = null;
  private canvasResizeObserver: ResizeObserver | null = null;
  private lastTimestamp = 0;
  private pendingBootstrap = false;
  private pressedLanes = Array.from({ length: GUITARRERO_LANE_COUNT }, () => false);

  readonly manifest = GUITARRERO_MANIFEST;
  readonly stage = GUITARRERO_STAGE_CONFIG;
  readonly songs = GUITARRERO_SONGS;
  readonly laneKeys = GUITARRERO_LANE_KEYS;
  readonly moodMeta = GUITARRERO_MOOD_META;
  readonly screen = signal<GuitarreroScreen>('menu');
  readonly isPaused = signal(false);
  readonly selectedSongId = signal(this.songs[0].id);
  readonly hud = signal<GuitarreroSceneSnapshot>(this.createIdleSnapshot(this.songs[0]));
  readonly result = signal<GuitarreroResultState | null>(null);
  readonly isPlaying = computed(() => this.screen() === 'playing');
  readonly isStageScreen = computed(() => this.screen() !== 'menu');
  readonly canvasViewport = signal({
    width: this.stage.width,
    height: this.stage.height
  });

  readonly selectedSong = computed(
    () => this.songs.find((song) => song.id === this.selectedSongId()) ?? this.songs[0]
  );
  readonly resultMoodMeta = computed(() => this.moodMeta[this.result()?.mood ?? 'mas-o-menos']);

  @ViewChild('gameCanvas')
  set gameCanvasRef(value: ElementRef<HTMLCanvasElement> | undefined) {
    const canvas = value?.nativeElement;

    if (!canvas) {
      this.canvasContext = null;
      return;
    }

    canvas.width = this.stage.width;
    canvas.height = this.stage.height;
    this.canvasContext = canvas.getContext('2d');

    if (this.pendingBootstrap && this.canvasContext) {
      this.pendingBootstrap = false;
      this.bootstrapGameplay();
    }
  }

  @ViewChild('playScreen')
  set playScreenRef(value: ElementRef<HTMLElement> | undefined) {
    this.canvasResizeObserver?.disconnect();
    this.canvasResizeObserver = null;
    this.playScreenElement = value?.nativeElement ?? null;

    if (!this.playScreenElement) {
      return;
    }

    this.recalculateCanvasViewport();
    this.canvasResizeObserver = new ResizeObserver(() => {
      this.recalculateCanvasViewport();
    });
    this.canvasResizeObserver.observe(this.playScreenElement);
  }

  selectSong(songId: string): void {
    this.selectedSongId.set(songId);

    if (this.screen() !== 'playing') {
      this.hud.set(this.createIdleSnapshot(this.selectedSong()));
    }
  }

  startSelectedSong(): void {
    this.launchSong(this.selectedSong());
  }

  startSong(songId: string): void {
    const song = this.songs.find((current) => current.id === songId) ?? this.songs[0];

    this.selectedSongId.set(song.id);
    this.launchSong(song);
  }

  repeatSelectedSong(): void {
    this.startSelectedSong();
  }

  backToMenu(): void {
    this.stopRuntime();
    this.result.set(null);
    this.screen.set('menu');
    this.hud.set(this.createIdleSnapshot(this.selectedSong()));
  }

  ngOnDestroy(): void {
    this.canvasResizeObserver?.disconnect();
    this.stopRuntime();
  }

  formatAccuracy(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  private bootstrapGameplay(): void {
    if (!this.canvasContext) {
      this.pendingBootstrap = true;
      return;
    }

    const song = this.selectedSong();
    this.scene = new GuitarreroGameScene(song);
    this.lastTimestamp = 0;
    this.releaseAllLanes();
    this.bindInput();
    this.paintFrame();
    this.animationFrameId = window.requestAnimationFrame((timestamp) => this.tick(timestamp));
  }

  private launchSong(song: GuitarreroSong): void {
    this.stopRuntime();
    this.isPaused.set(false);
    this.result.set(null);
    this.hud.set(this.createIdleSnapshot(song));
    void this.audioService.start(song.audioSrc);
    this.screen.set('playing');
    this.pendingBootstrap = true;

    if (this.canvasContext) {
      this.pendingBootstrap = false;
      this.bootstrapGameplay();
    }
  }

  private bindInput(): void {
    this.inputService.attach({
      onLaneDown: (lane) => {
        if (this.isPaused()) {
          return;
        }

        this.pressedLanes[lane] = true;
        this.scene?.pressLane(lane);
        this.flushSceneEvents();
        this.paintFrame();
      },
      onLaneUp: (lane) => {
        if (this.isPaused()) {
          return;
        }

        this.pressedLanes[lane] = false;
        this.paintFrame();
      },
      onPauseToggle: () => {
        this.togglePause();
      },
      onBlur: () => {
        this.releaseAllLanes();
        this.paintFrame();
      }
    });
  }

  private tick(timestamp: number): void {
    if (!this.scene) {
      return;
    }

    if (this.isPaused()) {
      this.lastTimestamp = timestamp;
      this.paintFrame();
      this.animationFrameId = window.requestAnimationFrame((nextTimestamp) => this.tick(nextTimestamp));
      return;
    }

    const deltaMs =
      this.lastTimestamp === 0 ? 16 : Math.min(timestamp - this.lastTimestamp, 34);

    this.lastTimestamp = timestamp;
    this.scene.update(deltaMs);
    this.flushSceneEvents();
    this.paintFrame();

    if (this.scene.isFinished()) {
      this.finishGame();
      return;
    }

    this.animationFrameId = window.requestAnimationFrame((nextTimestamp) => this.tick(nextTimestamp));
  }

  private finishGame(): void {
    const scene = this.scene;

    if (!scene) {
      return;
    }

    const result = scene.buildResults();
    this.stopRuntime();
    this.result.set(result);
    this.screen.set('results');
    this.hud.set(this.createIdleSnapshot(result.song));
  }

  private paintFrame(): void {
    if (!this.scene || !this.canvasContext) {
      return;
    }

    const snapshot = this.scene.getSnapshot(this.pressedLanes);
    const decoratedSnapshot = {
      ...snapshot,
      isPaused: this.isPaused()
    };

    this.hud.set(decoratedSnapshot);
    this.renderer.render(this.canvasContext, decoratedSnapshot);
  }

  private flushSceneEvents(): void {
    if (!this.scene) {
      return;
    }

    const events = this.scene.drainEvents();

    if (events.some((event) => event.judgement === 'miss')) {
      this.audioService.punishMiss();
    }
  }

  private stopRuntime(): void {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.inputService.detach();
    this.audioService.stop();
    this.scene = null;
    this.lastTimestamp = 0;
    this.isPaused.set(false);
    this.releaseAllLanes();
  }

  private togglePause(): void {
    if (!this.scene || this.screen() !== 'playing') {
      return;
    }

    const nextPausedState = !this.isPaused();

    this.isPaused.set(nextPausedState);
    this.releaseAllLanes();

    if (nextPausedState) {
      this.audioService.pause();
    } else {
      void this.audioService.resume();
    }

    this.paintFrame();
  }

  private recalculateCanvasViewport(): void {
    if (!this.playScreenElement) {
      return;
    }

    const styles = window.getComputedStyle(this.playScreenElement);
    const horizontalPadding =
      parseFloat(styles.paddingLeft || '0') + parseFloat(styles.paddingRight || '0');
    const verticalPadding =
      parseFloat(styles.paddingTop || '0') + parseFloat(styles.paddingBottom || '0');

    this.syncCanvasViewport(
      this.playScreenElement.clientWidth - horizontalPadding,
      this.playScreenElement.clientHeight - verticalPadding
    );
  }

  private syncCanvasViewport(availableWidth: number, availableHeight: number): void {
    const maxWidth = Math.max(availableWidth, 0);
    const maxHeight = Math.max(availableHeight, 0);
    const aspectRatio = this.stage.width / this.stage.height;

    if (maxWidth === 0 || maxHeight === 0) {
      return;
    }

    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    this.canvasViewport.set({
      width: Math.floor(width),
      height: Math.floor(height)
    });
  }

  private releaseAllLanes(): void {
    this.pressedLanes = Array.from({ length: GUITARRERO_LANE_COUNT }, () => false);
  }

  private createIdleSnapshot(song: GuitarreroSong): GuitarreroSceneSnapshot {
    return {
      song,
      elapsedMs: 0,
      progress: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      hits: 0,
      misses: 0,
      counts: {
        perfect: 0,
        good: 0,
        miss: 0
      },
      mood: 'mas-o-menos',
      fever: {
        charge: 0,
        active: false,
        ready: false,
        streak: 0,
        multiplier: 1
      },
      feedback: null,
      visibleNotes: [],
      pressedLanes: Array.from({ length: GUITARRERO_LANE_COUNT }, () => false),
      isPaused: false
    };
  }
}
