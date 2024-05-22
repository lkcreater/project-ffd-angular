import { Component, Input, OnInit } from '@angular/core';
import { CardContentComponent } from '../../card-content/card-content.component';
import { ScoreResultComponent } from '../../score/score-result/score-result.component';
import { Router } from '@angular/router';
import { GameHelper } from '../../../helpers/game.helper';

@Component({
  selector: 'app-game-result',
  standalone: true,
  imports: [CardContentComponent, ScoreResultComponent],
  templateUrl: './game-result.component.html',
  styleUrl: './game-result.component.scss',
})
export class GameResultComponent implements OnInit {
  @Input({ required: true }) score!: number; 
  @Input({ required: true }) time!: number; 
  @Input({ required: true }) total!: number; 

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isAnimateScore = true;
    const gameScore = this.score;
    this.score = 0;
    this.showTime = GameHelper.convertToTime(this.time);
    setTimeout(() => {
      GameHelper.animateCount(0, gameScore, 1000, (val) => {
        this.score = val;
      });
    }, 1000);
  }
  
  showTime: string = '00:00';

  //-- set animation
  isAnimateScore: boolean = false;
  isAnimateTime: boolean = false;

  //-- set duration
  durationAnimateScore: string = '1s';
  durationAnimateTime: string = '1s';

  goToHome() {
    this.router.navigate(['']);
  }
}
