import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state-card',
  templateUrl: './empty-state-card.component.html',
  styleUrl: './empty-state-card.component.css'
})
export class EmptyStateCardComponent {
  readonly eyebrow = input('Base lista');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly notes = input<string[]>([]);
}
