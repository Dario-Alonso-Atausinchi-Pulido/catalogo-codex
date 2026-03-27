import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameManifest } from '../../../games/engine/models/game-manifest.model';

@Component({
  selector: 'app-game-card',
  imports: [RouterLink],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css'
})
export class GameCardComponent {
  readonly game = input.required<GameManifest>();
}
