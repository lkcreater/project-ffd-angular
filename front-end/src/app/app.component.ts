import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { LineService } from './services/line/line.service';
import { Store } from '@ngrx/store';
import { actionLoadLineChanel } from './stores/line-chanel/line-chanel.action';
import { actionLoadTermCondition } from './stores/term-condition/term-condition.action';
import { TermConditionService } from './services/term-condition/term-condition.service';
import { UploadService } from './services/upload/upload.service';
import { actionLoadConfig } from './stores/config/config.action';
import { UserInfoService } from './services/user-info/user-info.service';
import { firstValueFrom } from 'rxjs';
import { LoadingComponent } from './components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private lineService: LineService,
    private termConditionService: TermConditionService,
    private uploadService: UploadService,
    private userInfoService: UserInfoService,
    private store: Store
  ) {}

  isLoading: boolean = true;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.all([
        this.setLoadUploadConfig(),
        this.setActionLineChanel(),
        this.setActionTermCondition(),
        this.setUserDataUserInfo(),
      ]).then((values) => {
        this.isLoading = false;
      });
    }
  }

  async setLoadUploadConfig() {
    const data = await firstValueFrom(this.uploadService.getConfiguration());
    this.store.dispatch(actionLoadConfig(data));
    return data;
  }

  async setActionLineChanel() {
    const data = await firstValueFrom(this.lineService.fetchLineChanelAll());
    this.store.dispatch(
      actionLoadLineChanel({ lineChanel: data?.lineChanel ?? [] })
    );
    return data;
  }

  async setActionTermCondition() {
    const data = await firstValueFrom(
      this.termConditionService.fetchTermCondition()
    );
    this.store.dispatch(actionLoadTermCondition({ data: data ?? null }));
    return data;
  }

  async setUserDataUserInfo() {
    const data = await firstValueFrom(this.userInfoService.fetchUserInfo());
    return data;
  }
}
