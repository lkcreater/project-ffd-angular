import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CardContentComponent } from '../../card-content/card-content.component';
import { CardExplainComponent } from '../../games/card-explain/card-explain.component';
import { CardGameTimingComponent } from '../../games/card-game-timing/card-game-timing.component';
import { CardBoardGameComponent } from '../../games/card-board-game/card-board-game.component';
import { IAnswer, IQuestion } from '../../../stores/game/game.reducer';
import { GameConfig, GameHelper } from '../../../helpers/game.helper';
import { CommonModule } from '@angular/common';
import { IOnAnswerGame } from '../game-play/game-play.component';

@Component({
  selector: 'app-game-true-false',
  standalone: true,
  imports: [
    CardContentComponent,
    CardExplainComponent,
    CardGameTimingComponent,
    CardBoardGameComponent,
    CommonModule
  ],
  templateUrl: './game-true-false.component.html',
  styleUrl: './game-true-false.component.scss',
})
export class GameTrueFalseComponent implements OnInit {
  @Input({ required: true }) question!: IQuestion;
  @Input({ required: true }) gameHelper!: GameHelper; 
  @Input() currentCount: number = 0;
  @Input() totalCount: number = 0;
  @Output() onAnswer = new EventEmitter<IOnAnswerGame>();

  @ViewChild(CardGameTimingComponent) cardGameTimingComponent!: CardGameTimingComponent;

  ngOnInit(): void {
    this.choices = this.question?.answers ?? [];
    this.startQuestion();

    //-- เวลา
    this.startTime = this.gameHelper.getTimeMax();

    //-- หาคำตอบที่ถูก
    this.choices.forEach(choice => {
      if(choice.gmAnsChoice?.result == true) {
        this.answerTitle = choice.gmAnsChoice?.choice;
        if(choice.gmAnsChoice?.detail && choice.gmAnsChoice?.detail != ''){
          this.answerExplain = choice.gmAnsChoice?.detail;
        }
      }
    });
  }

  //-- เวลา
  startTime!: number;

  //-- คำตอบ
  answerTitle: string = 'คำตอบของคุณคือ';
  answerExplain: string = 'ไม่พบคำอธิบาย';

  //-- var env
  isRun: boolean = false;
  showAnswer: boolean = false;
  choices: IAnswer[] = [];
  choiceAnswer: IOnAnswerGame | null = null;

  startQuestion() {
    this.isRun = true;
    setTimeout(() => {
      this.cardGameTimingComponent.startTimer();
    }, GameConfig.timeQuestionStart);
  }

  chooseAnswer(answer: IAnswer): void {
    const time = this.cardGameTimingComponent.stopTimer();
    const result = answer.gmAnsChoice?.result ?? false;
    const score = (result) ? this.gameHelper.getScore(time) : 0;
    this.showAnswer = true;
    this.choiceAnswer = {
      time: time,
      isPass: result,
      score: score,
      answer: answer,
      total: this.gameHelper.getScorePerQuestion()
    };
  }

  submitAnswer() {
    if(this.choiceAnswer) {
      this.onAnswer.emit(this.choiceAnswer);
    }
  }
}
