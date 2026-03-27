import { Component, inject } from '@angular/core';
import { GameCatalogService } from '../../../core/services/game-catalog.service';
import { EmptyStateCardComponent } from '../../../shared/ui/empty-state-card/empty-state-card.component';
import { GameCardComponent } from '../../components/game-card/game-card.component';

interface CatalogPrinciple {
  title: string;
  description: string;
}

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
    'Crea un slug en kebab-case dentro de src/app/games/library/<game-slug>/.',
    'Registra el manifiesto y las rutas del juego sin tocar otros juegos.',
    'Guarda los assets del juego en public/assets/games/<game-slug>/ para mantener el aislamiento.'
  ];
  readonly architecturePillars = [
    {
      title: 'Catalogo separado del motor canvas',
      description:
        'La UI del catalogo vive en su propia feature y consume un registro central de juegos. El motor base queda desacoplado de la navegacion y de la capa visual del catalogo.'
    },
    {
      title: 'Juegos encapsulados por slug',
      description:
        'Cada juego futuro tendra su propio folder, sus rutas, sus escenas, su UI y su config. Eso evita cruces de imports entre juegos y mantiene el crecimiento bajo control.'
    },
    {
      title: 'Assets ordenados por dominio',
      description:
        'Los recursos globales viven en public/assets/global y los recursos de un juego se guardan solo dentro de public/assets/games/<game-slug>/.'
    }
  ] satisfies CatalogPrinciple[];
}
