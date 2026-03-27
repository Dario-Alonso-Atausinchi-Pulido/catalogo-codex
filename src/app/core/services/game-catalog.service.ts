import { Injectable } from '@angular/core';
import { GameManifest } from '../../games/engine/models/game-manifest.model';
import { GAME_LIBRARY_REGISTRY } from '../../games/library/game-library.registry';

@Injectable({
  providedIn: 'root'
})
export class GameCatalogService {
  listGames(): GameManifest[] {
    return [...GAME_LIBRARY_REGISTRY].sort((left, right) => left.order - right.order);
  }

  findBySlug(slug: string): GameManifest | undefined {
    return GAME_LIBRARY_REGISTRY.find((game) => game.slug === slug);
  }
}
