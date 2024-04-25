import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-intro-game',
  standalone: true,
  imports: [],
  templateUrl: './card-intro-game.component.html',
  styleUrl: './card-intro-game.component.scss',
})
export class CardIntroGameComponent {
  @Input() openDetail: boolean = false;
}
