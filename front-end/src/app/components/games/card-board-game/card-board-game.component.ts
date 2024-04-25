import { Component, Input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-card-board-game',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './card-board-game.component.html',
  styleUrl: './card-board-game.component.scss',
})
export class CardBoardGameComponent {}
