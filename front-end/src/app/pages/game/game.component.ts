import { Component } from '@angular/core';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { CardIntroGameComponent } from '../../components/games/card-intro-game/card-intro-game.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CardContentComponent, CardIntroGameComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {}
