import { Component, Input, OnInit } from '@angular/core';
import { EFormatGameKey, GameHelper } from '../../../helpers/game.helper';
import { IAnswer, IQuestion, IRootBoardGame } from '../../../stores/game/game.reducer';
import { GameTrueFalseComponent } from '../game-true-false/game-true-false.component';
import { CommonModule } from '@angular/common';
import { GameService, IBodySaveHistory } from '../../../services/games/game.service';
import { UserInfoService } from '../../../services/user-info/user-info.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export interface IOnAnswerGame {
  time: number;
  isPass: boolean;
  score: number;
  total: number;
  answer: IAnswer;
  options?: any;
}

@Component({
  selector: 'app-game-play',
  standalone: true,
  imports: [
    CommonModule,
    GameTrueFalseComponent,
  ],
  templateUrl: './game-play.component.html',
  styleUrl: './game-play.component.scss'
})
export class GamePlayComponent implements OnInit {
  @Input({ required: true }) questionsAll!: IQuestion[];
  @Input({ required: true }) gameHelper!: GameHelper; 
  @Input({ required: true }) gameBoard!: IRootBoardGame;

  constructor(
    private router: Router,
    private notification: NzNotificationService,
    private userInfoService: UserInfoService, 
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.startGame();
  }

  readonly formatGameKey: typeof EFormatGameKey = EFormatGameKey;

  //-- action game
  level!: number;
  index!: number;
  questMax!: number;
  question!: IQuestion;
  answerResult: IOnAnswerGame[] = [];

  startGame() {
    this.index = 0;
    this.questMax = this.questionsAll?.length ?? 0; 
    if(this.questionsAll[this.index]) {
      this.level = this.questionsAll[this.index]?.gmQuestLevel ?? 0;
    }
  }

  onAnswerGame(data: IOnAnswerGame) {
    this.index++;
    this.answerResult.push(data);
    if(!this.questionsAll[this.index]) {
      const score = this.calculateScore();
      this.actionSaveHistoryGame({
        gmBoardId: this.gameBoard.gmBoardId,
        gmGameFormatKey: this.gameHelper.getFormat(),
        gmGameLevel: this.level,
        gmScore: score.score,
        gmScoreTotal: score.total,
        gmTime: score.time,
        gmHisSystem: this.gameBoard,
        gmHisRecord: {
          answser: this.answerResult,
          score: score
        },
        gmHisGameRule: this.gameHelper.getRules()
      }, score)
    }
  }

  actionSaveHistoryGame(body: IBodySaveHistory, score: any) {
    const token = this.userInfoService.getToken();
    if (token) {
      this.gameService.saveHistoryGame(token, body).subscribe(res => {
        if(res) {
          this.router.navigate(['/game/complete'], {
            state: { result: score, respone: res },
          });
        }
      });
    }
  }

  calculateScore() {
    let score = 0;
    let time = 0;
    let total = 0;
    this.answerResult.forEach(answer => {
      score += answer.score;
      time += answer.time;
      total += answer.total;
    });

    return {
      score,
      time,
      total
    }
  }

  convertToTime(time: number) {
    return Math.floor(time / 60) + ":" + (time % 60 ? time % 60 : '00')
  }
}
