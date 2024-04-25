import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent implements OnInit, OnDestroy {
  @Input() animated: boolean = false;
  @Input() imageLoading: string = 'assets/logo/rectangle-loading.png';
  @Input() title: string = 'Loading...';
  @Input() desc: string = '';

  isPlay: boolean = false;
  timeInterval: any;
  animateClass: string[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.animated) {
        this.setAnimate();
      }
    }
  }

  setAnimate() {
    this.timeInterval = setInterval(() => {
      if (this.isPlay) {
        this.animateClass = ['animate__animated', 'animate__bounce'];
      } else {
        this.animateClass = [];
      }
      this.isPlay = !this.isPlay;
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
  }
}
