import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutComponent } from '../layouts/pages-layout/pages-layout.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { authenticateGuard } from '../core/guards/authenticate/authenticate.guard';
import { HealthCheckComponent } from './health-check/health-check.component';
import { TestComponent } from './test/test.component';
import { ProfileConnectComponent } from './profile-connect/profile-connect.component';
import { ProfileChangePasswordComponent } from './profile-change-password/profile-change-password.component';
import { RankingComponent } from './ranking/ranking.component';
import { GameComponent } from './game/game.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GameCompleteComponent } from './game-complete/game-complete.component';
import { ArticleComponent } from './article/article.component';

const routes: Routes = [
  {
    path: '',
    component: PagesLayoutComponent,
    canActivate: [authenticateGuard],
    children: [
      {
        path: '',
        component: WelcomeComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'ranking',
        component: RankingComponent,
      },
      {
        path: 'article',
        component: ArticleComponent,
      },
      {
        path: 'game',
        children: [
          {
            path: '',
            component: GameComponent,
          },
          {
            path: 'play/:id',
            component: GameDetailComponent,
          },
          {
            path: 'complete',
            component: GameCompleteComponent,
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            component: ProfileComponent,
          },
          {
            path: 'connect',
            component: ProfileConnectComponent,
          },
          {
            path: 'change-password',
            component: ProfileChangePasswordComponent,
          },
        ],
      },
      {
        path: 'health-check',
        component: HealthCheckComponent,
      },
      {
        path: 'test',
        component: TestComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
