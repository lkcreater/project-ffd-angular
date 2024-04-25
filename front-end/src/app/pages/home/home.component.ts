import { Component } from '@angular/core';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { HomeBannerAccountComponent } from '../../components/page-home/home-banner-account/home-banner-account.component';
import { HomeBannerComponent } from '../../components/page-home/home-banner/home-banner.component';
import { HomeMenuComponent } from '../../components/page-home/home-menu/home-menu.component';

export interface IMenuHome {
  id: string;
  icon: string;
  label: string;
  color: string;
}
const homeMenu: IMenuHome[] = [
  {
    icon: 'assets/home/game.svg',
    label: 'เล่นเกม',
    color: '#005DA5',
    id: 'btn-home-game',
  },
  {
    icon: 'assets/home/reward.svg',
    label: 'แลกรางวัล',
    color: '#F49B00',
    id: 'btn-home-reward',
  },
  {
    icon: 'assets/home/leaderboard.svg',
    label: 'ตารางคะแนน',
    color: '#FF636B',
    id: 'btn-home-leaderboard',
  },
  {
    icon: 'assets/home/learning.svg',
    label: 'เรียนรู้เพิ่มเติม',
    color: '#02AFED',
    id: 'btn-home-learning',
  },
];
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardContentComponent,
    HomeBannerAccountComponent,
    HomeBannerComponent,
    HomeMenuComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  homeMenuList: IMenuHome[] = homeMenu;
}
