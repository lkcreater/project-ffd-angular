import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { Router, RouterLink } from '@angular/router';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { IUserInfoData } from '../../stores/user-info/user-info.reducer';
import { IInfoProfile, ILoginChanel } from '../../stores/user-info/user-info.actions';
import { CardAvatarComponent } from '../../components/card-avatar/card-avatar.component';
import { InputChangeProfileComponent } from '../../components/inputs/input-change-profile/input-change-profile.component';
import { ProfileService } from '../../services/profile/profile.service';
import { InputUpdateTextComponent } from '../../components/inputs/input-update-text/input-update-text.component';
import { UploadService } from '../../services/upload/upload.service';
import { LineService } from '../../services/line/line.service';
import { InputConnectAccountComponent } from '../../components/inputs/input-connect-account/input-connect-account.component';
import { ILineProviderEnv, TChanelAuthen } from '../../core/interfaces';
import { Subscription } from 'rxjs';
import { ConsentService } from '../../services/consent/consent.service';
import { DrawerConsentComponent, IContentDrawerConsent } from '../../components/drawer-consent/drawer-consent.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TextHelper } from '../../helpers/text.helper';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

export type TButtonLabelAccount = 'connect' | 'disconnect';
export interface IChannelConnectAccount {
  chanelId?: number;
  isConnected: boolean;
  type: TChanelAuthen;
  loginData: string;
  buttonLabel: TButtonLabelAccount;
  buttonDisable: boolean;
  lineProvide?: ILineProviderEnv;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    NzDrawerModule,
    NzModalModule,
    NzIconModule,
    NzPopconfirmModule,
    CardContentComponent,
    CardAvatarComponent,
    InputChangeProfileComponent,
    InputUpdateTextComponent,
    InputConnectAccountComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private notification: NzNotificationService,
    private drawerService: NzDrawerService,
    private userInfoService: UserInfoService,
    private uploadService: UploadService,
    private lineService: LineService,
    private consentService: ConsentService,
    private profileService: ProfileService,
    private router: Router,
  ) {}
  
  ngOnInit(): void {
    this.actionInitialize();
  }

  ngOnDestroy(): void {
    if (this._drawerConsentRef) {
      this._drawerConsentRef.unsubscribe();
    }

    if(this._subscriptionUserInfoService) {
      this._subscriptionUserInfoService.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this._window = window;
  }

  //-- private state
  _window!: Window;
  _windowPopup!: Window | null;
  _drawerConsentRef!: Subscription;
  _subscriptionUserInfoService!: Subscription;

  //-- public state
  visibleModal: boolean = false;
  chooseAccount: {
    type: string;
    input: string;
  } | null = null;
  listAccount: {
    type: string;
    input: string;
    text: string;
  }[] = [];
  isChangePassword: boolean = false;
  token!: string;
  avatar!: string;
  userInfoData!: IUserInfoData<IInfoProfile>;
  lineProvide!: ILineProviderEnv[];
  connectAccount: IChannelConnectAccount[] = [];
  lineChannel: ILoginChanel | null | undefined = null;
  
  onUpdateProfile(data: {
    inputName: string;
    input: string;
  }) {
    if(this.token) {
      this.profileService.updateProfile(this.token, {
        [data.inputName]: data.input
      }).subscribe(res => {
        if(!res) {
          this.actionErrorApi()
        }
        this.notification.success('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ');
      });
    }
  }

  actionInitialize(): void {
    this.isChangePassword = false;
    this.connectAccount = [];
    const platformArray: TChanelAuthen[] = ['EMAIL', 'PHONE'];
    let channelLogins: ILoginChanel[] = [];
    //-- set token
    this.token = this.userInfoService.getToken() || '';
    //-- load info
    this._subscriptionUserInfoService = this.userInfoService.getUserInfo().subscribe(res => {
      this.userInfoData = res;
      const linkUrl = this.uploadService.getUrl(res.userInfo?.accPicture)
      if(linkUrl){
        this.avatar = linkUrl;
      }

      this.lineChannel = this.userInfoData.userInfo?.chanelLogin?.find(u => u.loginPlatform == 'LINE');

      channelLogins = this.userInfoData.userInfo?.chanelLogin;
      channelLogins?.forEach( log => {
        if(['EMAIL', 'PHONE'].includes(log.loginPlatform)) {
          this.isChangePassword = true;
        }
      });

      for(let plat of platformArray) {
        const userConnect = this.userInfoData.userInfo?.chanelLogin?.find(u => u.loginPlatform == plat);
        if(userConnect) {
          this.connectAccount.push({
            chanelId: userConnect.id,
            type: plat,
            isConnected: true,
            loginData: userConnect.loginData,
            buttonLabel: 'disconnect',
            buttonDisable: this.isDisableConnected(channelLogins, 'disconnect')
          })
        } else {
          this.connectAccount.push({
            type: plat,
            isConnected: false,
            loginData: '',
            buttonLabel: 'connect',
            buttonDisable: this.isDisableConnected(channelLogins, 'connect')
          })
        }
      }
    });

    //-- load line provide
    this.lineService.getLineChanels().subscribe(lines => {
      this.lineProvide = lines;
      const linePlatArray = this.userInfoData.userInfo?.chanelLogin?.find(u => u.loginPlatform == 'LINE');
      for(let line of lines) {
        const lineConnect = this.userInfoData.userInfo?.chanelLogin?.find(u => u.loginPlatform == 'LINE' && u.lineClientId == line.clientId);
        if(lineConnect) {
          this.connectAccount.push({
            chanelId: lineConnect.id,
            type: 'LINE',
            isConnected: true,
            loginData: lineConnect.loginData,
            lineProvide: line,
            buttonLabel: 'disconnect',
            buttonDisable: this.isDisableConnected(channelLogins, 'disconnect', true)
          })
        } else {
          this.connectAccount.push({
            type: 'LINE',
            isConnected: false,
            loginData: '',
            lineProvide: line,
            buttonLabel: 'connect',
            buttonDisable: this.isDisableConnected(channelLogins, 'connect', true)
          })
        }
      }
    })
  }

  actionChangePassord() {
    if(this.isChangePassword) {
      this.listAccount = []; 
      this.userInfoData.userInfo?.chanelLogin.forEach( e => {
        if(['EMAIL', 'PHONE'].includes(e.loginPlatform)) {
          this.listAccount.push({
            type: e.loginPlatform,
            input: e.loginData,
            text: TextHelper.maskInput(e.loginPlatform as 'EMAIL' | 'PHONE', e.loginData)
          });
        }
      });

      if(this.listAccount.length > 1) {
        this.visibleModal = true;
      } else {
        this.router.navigate(['/profile/change-password'], { state: { type: this.listAccount[0].type, input: this.listAccount[0].input } });
      }
    }
  }

  modalHandleCancel() {
    this.visibleModal = false;
  }

  actionChooseAccount(data: {
    type: string;
    input: string;
    text: string;
  }) {
    this.visibleModal = false;
    this.router.navigate(['/profile/change-password'], { state: { type: data.type, input: data.input } });
  }

  isDisableConnected(logins: ILoginChanel[], action: 'disconnect' | 'connect', isLine: boolean = false): boolean {
    if(action == 'disconnect') {
      if(logins.length <= 1) {
        return true
      }

      //-- line
      if(isLine) {
        const line = logins.find(e => e.loginPlatform == 'LINE');
        if(line?.isLineLiff == true) {
          return true;
        }
      }
    }

    if(action == 'connect') {
      //-- line
      if(isLine) {
        const line = logins.find(e => e.loginPlatform == 'LINE');
        if(line) {
          return true;
        }
      }
    }
    return false
  }

  onAction(account: IChannelConnectAccount) {
    //-- connect account
    if(account.isConnected == false) {
      if(account.type == 'LINE') {
        this.connectLine(account);
      }else {
        this.router.navigate(['/profile/connect'], { state: { type: account.type } });
      }
    }

    //-- disconnect account
    if(account.isConnected == true) {
      if(this.token && account?.chanelId) {
        this.profileService.disconnectAccount(this.token, account?.chanelId).subscribe(res => {
          if(!res){
            this.actionErrorApi();
          }
          this.reGetUserInfo();
          this.notification.success('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ');
        });
      }
    }
  }

  connectLine(line: IChannelConnectAccount) {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=500,height=650,left=400,top=100`;
    if(this._window && line?.lineProvide) {
      const url = this.lineService.getUrlAuthenLine(line.lineProvide, 'CONNECT')
      this._windowPopup = this._window.open(url, line.lineProvide?.name ?? 'line connect', params)
    }
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if(event.data?.isConnect) {
      if(this._windowPopup){
        this._windowPopup.close();
        this.reGetUserInfo(true);
      }
    }
  }

  actionReconsent() {
    if(this.lineChannel) {
      this.reGetUserInfo(true);
    }
  }

  reGetUserInfo(isCallConsent: boolean = false) {
    if(this.token) {
      this.userInfoService.setUserInfo(this.token).subscribe(userInfo => {
        if(userInfo){
          this.actionInitialize();
          if(isCallConsent) {
            this.checkVersionConsentLine(this.token);
          }
        }
      });
    }
  }

  //-- check consent
  checkVersionConsentLine(token: string) {
    //-- check consent
    this.consentService.checkVersion(token).subscribe((res) => {
      if (!res) {
        this.actionErrorApi();
      }

      if (res?.isAcceptConsent == false) {
        this.openDrawerConsent(token);
      } else {
        this.notification.warning('แจ้งเตือน', res?.message ?? 'ไม่พบ consent');
      }
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
      this.notification.success('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ');
    });
  }

  actionErrorApi() {
    this.notification.error('Error', 'server error');
  }
}
