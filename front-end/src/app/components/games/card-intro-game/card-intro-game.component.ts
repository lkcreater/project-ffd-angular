import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { IQuestion, IRootBoardGame } from '../../../stores/game/game.reducer';
import { Router } from '@angular/router';
import { GameService } from '../../../services/games/game.service';
import { UploadService } from '../../../services/upload/upload.service';
import { UserInfoService } from '../../../services/user-info/user-info.service';

@Component({
  selector: 'app-card-intro-game',
  standalone: true,
  imports: [],
  templateUrl: './card-intro-game.component.html',
  styleUrl: './card-intro-game.component.scss',
})
export class CardIntroGameComponent implements OnInit {
  @Input() openDetail: boolean = false;
  @Input() dataBoard!: IRootBoardGame;

  constructor(
    private router: Router,
    private gameService: GameService,
    private uploadService: UploadService,
    private userInfoService: UserInfoService
  ) {}

  history: any[] = []; 
  hisPlaying: {
    countPlaying: number;
    maxLimit: number
  } = {
    countPlaying: 0,
    maxLimit: 1
  };

  ngOnInit(): void {
    this.gameService.getGameAll().subscribe(game => {
      this.history = game.histroy;
      this.hisPlaying = this.displayCountHistory();
    })
  }

  getUrl() {
    return this.uploadService.getUrl(this.dataBoard.gmBoardImage);
  }

  displayCountHistory() {
    const countPlaying = this.history.find(r => r.board_id == this.dataBoard?.gmBoardId)?.counter ?? 0;
    const maxLimit = this.dataBoard?.format?.gmRuleGame?.limitHistoryCaleScore ?? 1;
    return {
      countPlaying,
      maxLimit
    }
  }
}
