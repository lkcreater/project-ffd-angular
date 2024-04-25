import { JsonPipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import liff, { Liff } from '@line/liff';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoadingAuthenLineComponent } from '../../components/loading-authen-line/loading-authen-line.component';
import { Subscription } from 'rxjs';
import { ILineProvider, IObjectLineProvide, LineService } from '../../services/line/line.service';
import { ILineProviderEnv } from '../../core/interfaces';

@Component({
  selector: 'app-liff-authen',
  standalone: true,
  imports: [NzButtonModule, JsonPipe, LoadingAuthenLineComponent],
  templateUrl: './liff-authen.component.html',
  styleUrl: './liff-authen.component.scss',
})
export class LiffAuthenComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private lineService: LineService
  ) {}

  //-- private state
  private _subscriptRoute!: Subscription;
  private _objectLine!: Omit<IObjectLineProvide, 'authType' | 'code'>;

  //-- public state
  lineProvider: ILineProviderEnv[] = [];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      //-- load line provide
      this.lineService.getLineChanels().subscribe((res) => {
        this.lineProvider = res;
      });

      //-- query params
      this._subscriptRoute = this.route.queryParams.subscribe((params) => {
        this._objectLine = this.queryParamsCode(params)
        if(!this._objectLine.status) {
          this.notification.warning(
            'แจ้งเตือน',
            'LINE Provider ไม่ถูกต้องกรุณาตรวจสอบ'
          );
          this.actionRedirect();
        }

        this.lineService
          .connectLineLiff(this._objectLine.lineProvide.liffId)
          .subscribe((token) => {
            if (typeof token === 'string') {
              this.routerSendObject(
                this._objectLine.lineProvide.clientId,
                token
              );
            }
          });
      });
    }
  }

  ngOnDestroy(): void {
    if(this._subscriptRoute) {
      this._subscriptRoute.unsubscribe();
    }
  }

  //-- setup parameters
  queryParamsCode(params: Params): Omit<IObjectLineProvide, 'authType' | 'code'> {
    let lineState = params['liffClientId'] ?? null;
    let status = (lineState != null);

    const lineProvide = this.lineProvider.find(
      (line) => line.state == lineState
    );
    if (!lineProvide) {
      status = false;
    }

    return {
      status,
      lineState,
      lineProvide: lineProvide as ILineProvider,
    };
  }

  routerSendObject(clientId: string, token: string) {
    this.router.navigate(['/auth/callback'], {
      state: { token, clientId },
      queryParams: { state: clientId + '@LIFF' },
    });
  }

  actionRedirect() {
    this.router.navigate(['/']);
  }

  actionLogIn() {
    if (liff.isLoggedIn() == true) {
      liff.logout();
    }
    if (liff.isLoggedIn() == false) {
      liff.login();
    }
  }

  actionLogOut() {
    if (liff.isLoggedIn() == true) {
      liff.logout();
    }
  }
}
