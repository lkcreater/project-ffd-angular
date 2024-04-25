import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-game-timing',
  standalone: true,
  imports: [],
  templateUrl: './card-game-timing.component.html',
  styleUrl: './card-game-timing.component.scss',
})
export class CardGameTimingComponent implements OnInit {
  seconds: number = 0;
  interval: any;

  constructor() {}

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.seconds++;
    }, 1000);
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
