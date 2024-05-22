import { Component } from '@angular/core';
import { CardContainerComponent } from '../card-container/card-container.component';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../layouts/header/header.component';
import { EnvHelper } from '../../helpers/env.helper';

@Component({
  selector: 'app-card-welcome',
  standalone: true,
  imports: [CardContainerComponent, RouterLink, HeaderComponent],
  templateUrl: './card-welcome.component.html',
  styleUrl: './card-welcome.component.scss'
})
export class CardWelcomeComponent {
  imgSrc = './assets/logo/welcome-home.png';
  imgFfd = './assets/home/icon-home-ffd.png';
  imgLogo = './assets/home/icon-home-logo.png';

  constructor(
    private router: Router
  ) {}

  isDemo = EnvHelper.key('isDemo');

  routerSendObject(url: any[], state: any = {}) {
    this.router.navigate(url, {
      state,
    });
  }
}
