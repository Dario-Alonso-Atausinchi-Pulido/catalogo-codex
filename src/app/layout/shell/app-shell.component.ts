import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { APP_SHELL_CONFIG } from '../../core/config/app-shell.config';
import { GameManifest } from '../../games/engine/models/game-manifest.model';
import { GAME_LIBRARY_REGISTRY } from '../../games/library/game-library.registry';
import { filter, fromEvent, map, startWith } from 'rxjs';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css'
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly nowPlayingCoverFallback = signal(false);

  @ViewChild('monitorFrame', { static: true })
  private monitorFrame?: ElementRef<HTMLElement>;

  readonly shell = APP_SHELL_CONFIG;
  readonly totalGames = GAME_LIBRARY_REGISTRY.length;
  readonly supportsFullscreen =
    typeof this.document.documentElement.requestFullscreen === 'function';
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );
  readonly isGameRoute = computed(() => this.currentUrl().startsWith('/games/'));
  readonly isCatalogRoute = computed(() => this.currentUrl() === '/catalog');
  readonly currentGame = computed<GameManifest | null>(() => {
    const url = this.currentUrl();

    return GAME_LIBRARY_REGISTRY.find((game) => url.startsWith(game.routePath)) ?? null;
  });
  readonly currentGameCoverPath = computed(() => {
    const game = this.currentGame();

    if (!game) {
      return '';
    }

    if (this.nowPlayingCoverFallback()) {
      return game.coverPlaceholderPath ?? '';
    }

    return game.coverImagePath ?? game.coverPlaceholderPath ?? '';
  });
  readonly isFullscreenActive = toSignal(
    fromEvent(this.document, 'fullscreenchange').pipe(
      map(() => Boolean(this.document.fullscreenElement)),
      startWith(Boolean(this.document.fullscreenElement))
    ),
    { initialValue: Boolean(this.document.fullscreenElement) }
  );

  constructor() {
    effect(() => {
      this.currentGame();
      this.nowPlayingCoverFallback.set(false);
    });
  }

  goHome(): void {
    void this.router.navigateByUrl('/catalog');
  }

  goBack(): void {
    void this.router.navigateByUrl('/catalog');
  }

  restartCurrentGame(): void {
    if (!this.isGameRoute()) {
      return;
    }

    window.location.reload();
  }

  async toggleFullscreen(): Promise<void> {
    if (!this.isGameRoute() || !this.supportsFullscreen || !this.monitorFrame) {
      return;
    }

    if (this.document.fullscreenElement) {
      if (typeof this.document.exitFullscreen === 'function') {
        await this.document.exitFullscreen();
      }
      return;
    }

    await this.monitorFrame.nativeElement.requestFullscreen();
  }

  useNowPlayingFallback(): void {
    if (this.currentGame()?.coverPlaceholderPath) {
      this.nowPlayingCoverFallback.set(true);
    }
  }
}
