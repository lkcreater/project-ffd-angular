import { AfterViewInit, Component } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { VideoComponent } from '../../components/videos/video/video.component';
import { ScoreResultComponent } from '../../components/score/score-result/score-result.component';
import { PersonaResultComponent } from '../../components/persona/persona-result/persona-result.component';
import { QuestionSuccessComponent } from '../../components/question-success/question-success.component';
import { GameDetailComponent } from '../game-detail/game-detail.component';
import { GameResultComponent } from '../../components/games/game-result/game-result.component';
import { GameMatchingComponent } from '../../components/board-game/game-matching/game-matching.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CardHealthCheckConfirmComponent } from '../../components/card-health-check-confirm/card-health-check-confirm.component';
import { LoginDemoComponent } from '../login-demo/login-demo.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    GameComponent,
    VideoComponent,
    ScoreResultComponent,
    PersonaResultComponent,
    QuestionSuccessComponent,
    GameDetailComponent,
    GameResultComponent,
    GameMatchingComponent,
    NzModalModule,
    CardHealthCheckConfirmComponent,
    LoginDemoComponent,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements AfterViewInit {
  ngAfterViewInit(): void {}

  send() {
    const parentWindow = window.opener;

    // Pass value to parent window
    const message = 'Hello from child window!';
    parentWindow.postMessage(
      {
        isConnect: true,
        message,
      },
      '*'
    );
  }
}
