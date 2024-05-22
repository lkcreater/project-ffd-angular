import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GameRenderDetailComponent } from '../../components/games/game-render-detail/game-render-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/games/game.service';
import { UserInfoService } from '../../services/user-info/user-info.service';
import {
  IAnswer,
  IQuestion,
  IRootBoardGame,
} from '../../stores/game/game.reducer';
import { Subscription } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GameHelper } from '../../helpers/game.helper';
import { GameTrueFalseComponent } from '../../components/board-game/game-true-false/game-true-false.component';
import { CommonModule } from '@angular/common';
import { GamePlayComponent } from '../../components/board-game/game-play/game-play.component';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [
    CommonModule,
    GameRenderDetailComponent,
    GameTrueFalseComponent,
    GamePlayComponent,
  ],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.scss',
})
export class GameDetailComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private gameService: GameService,
    private userInfoService: UserInfoService
  ) {}

  ngOnInit(): void {
    this._paramSubscription = this.route.params.subscribe((params) => {
      this.paramId = Number(params['id']);
    });

    const token = this.userInfoService.getToken();
    if (token) {
      this.gameService
        .fetchGameBoardById(token, this.paramId)
        .subscribe((data) => {
          if (data) {
            this.playDetail = data;
            this.questionsAll = data.question;
            this.formatGame = new GameHelper(data.format);
          } else {
            this.notification.warning('แจ้งเตือน', 'ไม่พบข้อมูลที่ท่านเลือก');
            this.router.navigate(['/game']);
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this._paramSubscription) {
      this._paramSubscription.unsubscribe();
    }
  }

  //-- private state
  private _paramSubscription!: Subscription;

  //-- public state
  isPlaying: boolean = false;
  paramId!: number;

  //-- set object data game
  playDetail!: IRootBoardGame;
  formatGame!: GameHelper;
  questionsAll!: IQuestion[];

  //-- เริ่มเกมส์
  start(start: boolean) {
    this.isPlaying = start;
  }

  // gameInitail() {
  //   this.index = 0;
  //   this.questMax = this.questionsAll?.length ?? 0;
  //   this.getCurrentQuestion();
  // }

  // getCurrentQuestion() {
  //   this.question = this.questionsAll[this.index];
  //   if (!this.question) {
  //   }
  // }

  // onAnswerGame(data: IOnAnswerGame) {
  //   setTimeout(() => {
  //     this.index++;
  //     this.getCurrentQuestion();
  //   }, 1000);
  // }
}
