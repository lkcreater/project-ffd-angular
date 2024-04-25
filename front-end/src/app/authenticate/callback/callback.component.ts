import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { JsonPipe, isPlatformBrowser } from '@angular/common';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import {
  IArgumentLineToken,
  ILineProvider,
  ILoginLineParams,
  IObjectLineProvide,
  LineService,
} from '../../services/line/line.service';
import liff, { Liff } from '@line/liff';
import { ILineProviderEnv } from '../../core/interfaces';
import { Subscription } from 'rxjs';
import { TermConditionService } from '../../services/term-condition/term-condition.service';
import {
  DrawerTermConditionComponent,
  IContentDrawer,
} from '../../components/drawer-term-condition/drawer-term-condition.component';
import { ConsentService } from '../../services/consent/consent.service';
import { UserInfoService } from '../../services/user-info/user-info.service';
import {
  DrawerConsentComponent,
  IContentDrawerConsent,
} from '../../components/drawer-consent/drawer-consent.component';
import { LoadingAuthenLineComponent } from '../../components/loading-authen-line/loading-authen-line.component';
import { ProfileService } from '../../services/profile/profile.service';

export type TChooseTermConsent = 'term' | 'consent';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [
    JsonPipe,
    NzDrawerModule,
    NzNotificationModule,
    LoadingAuthenLineComponent,
  ],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private drawerService: NzDrawerService,
    private route: ActivatedRoute,
    private router: Router,
    private lineService: LineService,
    private notification: NzNotificationService,
    private termConditionService: TermConditionService,
    private consentService: ConsentService,
    private userInfoService: UserInfoService,
    private profileService: ProfileService
  ) {
    this.liffClient =
      (this.router.getCurrentNavigation()?.extras.state as {
        clientId: string;
        token: string;
      }) ?? null;
  }

  //-- private state
  private _drawerRef!: Subscription;
  private _drawerConsentRef!: Subscription;
  private _routeSubscription!: Subscription;
  private _objectLine!: IObjectLineProvide;
  private _resultAuthen!: {
    code: number;
    token: string;
  };

  //-- public state
  displayConnectLine = false;
  successImage = './assets/success/success.png';
  lineProvider: ILineProviderEnv[] = [];
  liffClient: { clientId: string; token: string } | null = null;
  dataLineLogin: ILoginLineParams | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.lineService.getLineChanels().subscribe((res) => {
        this.lineProvider = res;
      });

      this._routeSubscription = this.route.queryParams.subscribe((params) => {
        const objectLine = this.queryParamsCode(params);
        if (objectLine.status == false) {
          this.notification.warning(
            'แจ้งเตือน',
            'LINE Provider ไม่ถูกต้องกรุณาตรวจสอบ'
          );
          this.actionRedirect();
        }

        //-- set object line
        this._objectLine = objectLine;

        //-- login line web
        if (objectLine.authType == 'LINE') {
          this.fetchAuthenToken(objectLine.code);
        }

        //-- connect line web
        if (objectLine.authType == 'CONNECT') {
          this.fetchAuthenToken(objectLine.code);
        }

        //-- login line liff
        if (objectLine.authType == 'LIFF') {
          if(liff.isLoggedIn()){
            liff.logout();
          }
          const token = this.liffClient?.token ?? '';
          const clientId = this.liffClient?.clientId ?? '';
          this.fetchVerifyTokenLine(token, clientId);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this._routeSubscription) {
      this._routeSubscription.unsubscribe();
    }

    if (this._drawerRef) {
      this._drawerRef.unsubscribe();
    }

    if (this._drawerConsentRef) {
      this._drawerConsentRef.unsubscribe();
    }
  }

  //-- setup parameters
  queryParamsCode(params: Params): IObjectLineProvide {
    let code = params['code'];
    let authType = params['state'].split('@')[1] ?? null;
    let lineState = params['state'].split('@')[0] ?? null;
    let status = code && authType != null && lineState != null;

    const lineProvide = this.lineProvider.find(
      (line) => line.state == lineState
    );
    if (!lineProvide) {
      status = false;
    }

    return {
      status,
      code,
      authType,
      lineState,
      lineProvide: lineProvide as ILineProvider,
    };
  }

  //-- authentication line
  async fetchAuthenToken(code: string) {
    const argParams: IArgumentLineToken = {
      code: code,
      redirect_uri: this._objectLine.lineProvide.pathCallback,
      client_id: this._objectLine.lineProvide.clientId,
      client_secret: this._objectLine.lineProvide.clientSecret,
    };
    this.lineService.fetchLineToken(argParams).subscribe((res) => {
      if (res?.id_token) {
        this.fetchVerifyTokenLine(
          res?.id_token,
          this._objectLine.lineProvide.clientId
        );
      }
    });
  }

  //-- verify token line
  fetchVerifyTokenLine(idToken: string, clientId: string) {
    this.lineService
      .fetchLineVerify({ id_token: idToken, client_id: clientId })
      .subscribe((res) => {
        if (res?.sub) {
          const dataBody: ILoginLineParams = {
            loginData: res.sub,
            accPicture: res.picture,
            accFirstname: res.name,
            lineClientId: res.aud,
            optionsLine: res,
          };

          this.dataLineLogin = dataBody;
          if(this._objectLine.authType == 'CONNECT') {
            this.connectAccountLine(dataBody)
          } else {
            this.fetchLineAuthenWebBackEnd(dataBody);
          }
        }
      });
  }

  //-- connect account line
  connectAccountLine(body: ILoginLineParams) {
    const token = this.userInfoService.getToken();
    console.log(token);
    if(token){
      this.profileService.connectAccount(token, {
        loginData: body.loginData,
        loginPlatform: 'LINE',
        lineClientId: body.lineClientId
      }).subscribe(res => {
        if(!res) {
          this.actionErrorApi();
        }

        if(res?.isConnected == true) {
          console.log('connected ', res);
          this.displayConnectLine = true
          setTimeout(() => {
            const parentWindow = window.opener;
            parentWindow.postMessage({
              isConnect: true,
              ...this.dataLineLogin
            }, '*');
          }, 1000);
        }
      });
    }
  }

  //-- authen web backend
  fetchLineAuthenWebBackEnd(dataBody: ILoginLineParams) {
    this.lineService.authenLine(dataBody).subscribe((res) => {
      if (!res) {
        this.actionErrorApi();
      }

      this._resultAuthen = res ?? { code: 0, token: '' };
      //-- new user line
      if (res?.code == 200) {
        this.termConditionService.getTermCondition().subscribe((store) => {
          const { data } = store;
          if (data) {
            this.drawerTermCondition({
              value: 0,
              title: data.condiTopic,
              desc: data.condiText,
              notice: data.condiPrivacyNotice,
              version: data.condiVersion,
              btnAccept: data.condiOption[0]?.option ?? 1,
              btnReject: data.condiOption[1]?.option ?? 2,
            });
          } else {
          }
        });
      }

      //-- user login line
      if (res?.code == 100) {
        this.gotoLoginLine(res?.token);
      }
    });
  }

  //-- open term condition
  drawerTermCondition(dataDrawer: IContentDrawer) {
    const drawerRef = this.drawerService.create<
      DrawerTermConditionComponent,
      IContentDrawer
    >({
      nzClosable: false,
      nzWidth: '100%',
      nzHeight: '100%',
      nzPlacement: 'bottom',
      nzWrapClassName: 'app-drawer-term',
      nzContent: DrawerTermConditionComponent,
      nzData: dataDrawer,
    });

    this._drawerRef = drawerRef.afterClose.subscribe((termData) => {
      this.termConditionService
        .saveTermConditionAction(this._resultAuthen.token, {
          condiVersion: termData.version,
          option: termData.value,
        })
        .subscribe((res) => {
          if (!res) {
            this.actionErrorApi();
          }

          if (res?.saveCondition == true) {
            this.gotoLoginLine(res?.token ?? '');
          }

          if (res?.saveCondition == false) {
            this.router.navigate(['/auth/sign-in']);
          }
        });
    });
  }

  //-- check consent
  gotoLoginLine(token: string) {
    this.userInfoService.setUserInfo(token).subscribe((userInfo) => {
      if (!userInfo) {
        this.actionErrorApi();
      }

      //-- check consent
      this.consentService.checkVersion(token).subscribe((res) => {
        if (!res) {
          this.actionErrorApi();
        }

        if (res?.isAcceptConsent == false) {
          this.openDrawerConsent(token);
        } else {
          this.actionRedirect();
        }
      });
    });
  }

  //-- setup consent
  openDrawerConsent(token: string) {
    this.consentService.getConsent(token).subscribe((res) => {
      if (res?.consent) {
        const data = res?.consent;
        const drawerRef = this.drawerService.create<
          DrawerConsentComponent,
          IContentDrawerConsent
        >({
          nzClosable: false,
          nzWidth: '100%',
          nzHeight: '100%',
          nzPlacement: 'bottom',
          nzWrapClassName: 'app-drawer-term',
          nzContent: DrawerConsentComponent,
          nzData: {
            value: 0,
            title: data.ffdTargetConsentTopicThai,
            desc: data.ffdTargetConsentThai,
            version: data.ffdTargetConsentVersion,
            code: data.ffdTargetConsentCode,
            btnAccept: data.ffdTargetConsentOptionThai[0]?.option ?? 1,
            btnReject: data.ffdTargetConsentOptionThai[2]?.option ?? 2,
          },
        });

        this._drawerConsentRef = drawerRef.afterClose.subscribe(
          (consentData) => {
            this.saveConsent(token, {
              ffdTargetConsentCode: consentData.code,
              ffdTargetConsentVersion: consentData.version,
              option: consentData.value,
            });
          }
        );
      }
    });
  }

  saveConsent(
    token: string,
    body: {
      ffdTargetConsentCode: string;
      ffdTargetConsentVersion: string;
      option: number;
    }
  ) {
    this.consentService.saveConsent(token, body).subscribe((res) => {
      this.userInfoService.setUserInfo(token).subscribe(userInfo => {
        if(userInfo){
          this.actionRedirect();
        }
      });
    });
  }

  actionErrorApi() {
    this.notification.error('Error', 'server error');
    this.actionRedirect();
  }

  actionRedirect() {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }
}
