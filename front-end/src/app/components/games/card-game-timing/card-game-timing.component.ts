import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameHelper } from '../../../helpers/game.helper';

@Component({
  selector: 'app-card-game-timing',
  standalone: true,
  imports: [],
  templateUrl: './card-game-timing.component.html',
  styleUrl: './card-game-timing.component.scss',
})
export class CardGameTimingComponent implements OnInit, OnDestroy {
  @Input({ required: true }) startTime!: number;

  seconds: number = 0;
  interval: any;

  constructor() {}

  ngOnInit(): void {
    //this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.seconds++;
      if(this.startTime > 0) {
        this.startTime--;
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
    return this.seconds
  }

  convertToTime(time: number) {
    return GameHelper.convertToTime(time);
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    const minutesStr: string =
      minutes < 10 ? '0' + minutes : minutes.toString();
    const secondsStr: string =
      remainingSeconds < 10
        ? '0' + remainingSeconds
        : remainingSeconds.toString();
    return minutesStr + ':' + secondsStr;
  }
}
