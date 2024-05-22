import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { IUserInfoData } from '../../stores/user-info/user-info.reducer';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CardWelcomeComponent } from '../../components/card-welcome/card-welcome.component';
import { RouterLink } from '@angular/router';
import { CardRegisterSuccessComponent } from '../../components/card-register-success/card-register-success.component';
import { IInfoProfile } from '../../stores/user-info/user-info.actions';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    RouterLink,
    LoadingComponent,
    CardWelcomeComponent,
    CardRegisterSuccessComponent,
    HomeComponent,
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private userInfoService: UserInfoService
  ) {}

  userInfo!: IUserInfoData<IInfoProfile>;

  ngOnInit() {
    this.userInfoService.getUserInfo().subscribe((res) => {
      this.userInfo = res;
    });
  }
}
