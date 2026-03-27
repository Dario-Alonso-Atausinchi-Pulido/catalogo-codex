import { Component, input } from '@angular/core';

@Component({
  selector: 'app-canvas-stage',
  templateUrl: './canvas-stage.component.html',
  styleUrl: './canvas-stage.component.css'
})
export class CanvasStageComponent {
  readonly title = input('Canvas stage');
  readonly description = input('Base reutilizable para montar futuros minijuegos sobre HTML Canvas.');
  readonly width = input(960);
  readonly height = input(540);
}
