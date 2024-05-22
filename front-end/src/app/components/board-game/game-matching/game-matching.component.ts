import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { CardContentComponent } from '../../card-content/card-content.component';
import { CardGameTimingComponent } from '../../games/card-game-timing/card-game-timing.component';
import { CardMatchingGameComponent } from '../../games/card-matching-game/card-matching-game.component';

@Component({
  selector: 'app-game-matching',
  standalone: true,
  imports: [
    CardContentComponent,
    CardGameTimingComponent,
    CardMatchingGameComponent
  ],
  templateUrl: './game-matching.component.html',
  styleUrl: './game-matching.component.scss'
})
export class GameMatchingComponent implements AfterViewInit {
  @ViewChildren(CardMatchingGameComponent) cardMatchingGame!: QueryList<CardMatchingGameComponent>;

  ngAfterViewInit(): void {
    this.cardMatchingGame.forEach( card => {
      console.log(card);
    });
  }

  startTime: number = 20
  choices: Array<string> = ['1', '2', '3', '4', '5', '6']
  chooses: Array<number> = [];
  isDisabled: boolean = false;

  actionOpen(choice: any) {
    this.chooses.push(choice);
    if(this.chooses.length >= 2) {
      this.isDisabled = true;
      setTimeout(() => {
        this.clearChoosChoice();
      }, 1500);
    }
  }

  clearChoosChoice() {
    this.cardMatchingGame.forEach((card, idx) => {
      if(this.chooses.includes(idx)){
        card.isOpen = false;
      }
    });
    this.chooses = [];
    this.isDisabled = false;
  }
}
