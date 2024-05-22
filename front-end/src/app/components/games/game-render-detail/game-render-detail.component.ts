import { AfterViewInit, Component, EventEmitter, input, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CardIntroGameComponent } from '../card-intro-game/card-intro-game.component';
import { CardContentComponent } from '../../card-content/card-content.component';
import { IRootBoardGame } from '../../../stores/game/game.reducer';
import { GameService } from '../../../services/games/game.service';
import { UserInfoService } from '../../../services/user-info/user-info.service';

@Component({
  selector: 'app-game-render-detail',
  standalone: true,
  imports: [CardContentComponent, CardIntroGameComponent],
  templateUrl: './game-render-detail.component.html',
  styleUrl: './game-render-detail.component.scss',
})
export class GameRenderDetailComponent implements OnInit, OnChanges {
  @Input({ required: true }) detail!: IRootBoardGame;
  @Output() onStart = new EventEmitter<boolean>(false);

  constructor(private gameService: GameService,private userInfoService: UserInfoService) {}

  ngOnInit(): void {
    const token = this.userInfoService.getToken();
    if (token) {
      this.gameService.fetchGameHistory(token).subscribe( his => {
        this.gameHistory = his ?? [];
      });
    }
  }

  ngOnChanges(changes: any) {
  }

  gameHistory: any[] = []; 

  startGame() {
    this.onStart.emit(true);
  }
}
