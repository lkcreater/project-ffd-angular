import { Component, Input } from '@angular/core';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { HomeBannerAccountComponent } from '../../components/page-home/home-banner-account/home-banner-account.component';
import { HomeBannerComponent } from '../../components/page-home/home-banner/home-banner.component';
import { HomeMenuComponent } from '../../components/page-home/home-menu/home-menu.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
export interface IMenuHome {
  id: string;
  icon: string;
  label: string;
  color: string;
  page: string;
}
const homeMenu: IMenuHome[] = [
  {
    icon: 'assets/home/game.svg',
    label: 'เกม',
    color: '#005DA5',
    id: 'btn-home-game',
    page: '/game',
  },
  {
    icon: 'assets/home/article.svg',
    label: 'บทความทางการเงิน',
    color: '#F49B00',
    id: 'btn-home-reward',
    page: '/article',
  },
  {
    icon: 'assets/home/planmoney.svg',
    label: 'วางแผนการเงิน',
    color: '#FF636B',
    id: 'btn-home-leaderboard',
    page: '/ranking',
  },
  {
    icon: 'assets/home/plantax.svg',
    label: 'วางแผนภาษี',
    color: '#02AFED',
    id: 'btn-home-learning',
    page: '/test',
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
    NzModalModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @Input() hiddenHeaderScore: boolean = false;
  
  homeMenuList: IMenuHome[] = homeMenu;
}
