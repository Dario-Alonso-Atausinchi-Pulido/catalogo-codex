import { Component, inject } from '@angular/core';
import { GameCatalogService } from '../../../core/services/game-catalog.service';
import { EmptyStateCardComponent } from '../../../shared/ui/empty-state-card/empty-state-card.component';
import { GameCardComponent } from '../../components/game-card/game-card.component';

@Component({
  selector: 'app-catalog-page',
  imports: [EmptyStateCardComponent, GameCardComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css'
})
export class CatalogPageComponent {
  private readonly gameCatalogService = inject(GameCatalogService);

  readonly games = this.gameCatalogService.listGames();
  readonly onboardingSteps = [
    'Crea el slug y el manifiesto del juego.',
    'Agrega una portada placeholder dentro del slug.',
    'Registra la ruta para que aparezca en la biblioteca.'
  ];
}
