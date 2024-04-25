import { Component } from '@angular/core';

import { ScoreExpComponent } from '../../score/score-exp/score-exp.component';
import { ScorePointComponent } from '../../score/score-point/score-point.component';

@Component({
  selector: 'app-home-banner-account',
  standalone: true,
  imports: [ScoreExpComponent, ScorePointComponent],
  templateUrl: './home-banner-account.component.html',
  styleUrl: './home-banner-account.component.scss',
})
export class HomeBannerAccountComponent {}
