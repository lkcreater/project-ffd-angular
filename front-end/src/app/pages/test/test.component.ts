import { AfterViewInit, Component } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { VideoComponent } from '../../components/videos/video/video.component';
import { ScoreResultComponent } from '../../components/score/score-result/score-result.component';
import { PersonaResultComponent } from '../../components/persona/persona-result/persona-result.component';
import { QuestionSuccessComponent } from '../../components/question-success/question-success.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    GameComponent,
    VideoComponent,
    ScoreResultComponent,
    PersonaResultComponent,
    QuestionSuccessComponent,
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
