import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BtnLineLoginComponent } from '../../components/btn-line-login/btn-line-login.component';
import { Router, RouterLink } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDrawerService, NzDrawerModule } from 'ng-zorro-antd/drawer';
import { firstValueFrom, map, Subscription } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LabelInputLoadingComponent } from '../../components/inputs/label-input-loading/label-input-loading.component';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { LineService } from '../../services/line/line.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AuthenService } from '../../services/authen/authen.service';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { ILineProviderEnv } from '../../core/interfaces';
import { ConsentService } from '../../services/consent/consent.service';
import {
  DrawerConsentComponent,
  IContentDrawerConsent,
} from '../../components/drawer-consent/drawer-consent.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { ModalAlertComponent } from '../../components/modal-alert/modal-alert.component';
import { title } from 'process';
import { EnvHelper } from '../../helpers/env.helper';
import { LoginDemoComponent } from '../../pages/login-demo/login-demo.component';

export interface IDataSubmitConsent {
  consentDate: string;
  clientId: string;
  token: string;
  acceptConsent: boolean;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    NzFormModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    BtnLineLoginComponent,
    RouterLink,
    NzDrawerModule,
    NzIconModule,
    LabelInputLoadingComponent,
    NzDividerModule,
    CardContentComponent,
    NzAlertModule,
    ModalAlertComponent,
    LoginDemoComponent,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit, OnDestroy {
  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private drawerService: NzDrawerService,
    private userInfoService: UserInfoService,
    private notification: NzNotificationService,
    private authenService: AuthenService,
    private consentService: ConsentService,
    private lineService: LineService
  ) {}

  isDemo = EnvHelper.key('isDemo');

  //-- private state
  private _drawerConsentRef!: Subscription;

  //-- public state
  lineProvider: ILineProviderEnv[] = [];
  passwordVisible: boolean = false;
  password?: string;
  submitLoading: boolean = false;

  //-- block authen
  authenHistory: any[] = [];
  limitPassWrong:number = 0;
  limitBlockedAuthenWrong:number = 0;
  authenMsgAlert: string = '';
  authenBlocked: boolean = false;

  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true],
  });

  ngOnInit(): void {
    this.lineService.getLineChanels().subscribe((res) => {
      this.lineProvider = res;
    });
  }

  ngOnDestroy(): void {
    if (this._drawerConsentRef) {
      this._drawerConsentRef.unsubscribe();
    }
  }

  //-- submit login
  async submitLoginForm(): Promise<void> {
    this.submitLoading = true;
    if (this.validateForm.valid) {
      const { userName, password, remember } = this.validateForm.value;
      const input = userName?.toLowerCase();

      const auth = await firstValueFrom(this.authenService.getHistoryAuth({
        pwdAtInput: input ?? ''
      }));
      if(auth) {
        this.setObjectBlockRequest({ 
          ...auth,
          isView: true
        });
      }

      if(this.authenBlocked == false) {
        const authenVerify = await firstValueFrom(
          this.authenService.singInVerify(input ?? '', password ?? '')
        );

        if (authenVerify) {
          if(authenVerify?.status == 'LOCK_PWD') {
            this._setBlockAccount();
            this.validateForm.reset();
            this.submitLoading = false;
            return;
          }

          const confirmAuth = await firstValueFrom(
            this.authenService.singInConfirmSecret(
              input ?? '',
              password ?? '',
              authenVerify.hash,
              authenVerify.secretKey
            )
          );

          //-- password wrong limit 5
          if (!confirmAuth) {
            this.saveHisAuthentication({
              pwdAtHash: authenVerify.secretKey,
              pwdAtInput: input ?? '',
              pwdResult: false
            }, authenVerify.secretKey);
          }

          if (confirmAuth?.token) {
            const userInfo = await firstValueFrom(
              this.userInfoService.setUserInfo(confirmAuth?.token)
            );
            if (!userInfo) {
              this.actionErrorApi();
            }

            //-- not connect line
            if (confirmAuth?.isLineConnect == false) {
              this.actionRedirect();
            }

            //-- connect line
            if (confirmAuth?.isLineConnect == true) {
              this.checkVersionConsent(confirmAuth?.token);
            }
          }
        } else {
          this.saveHisAuthentication({
            pwdAtInput: input ?? '',
            pwdAtHash: null,
            pwdResult: false
          });
        }
      }

      this.validateForm.reset();
      this.submitLoading = false;
    } else {
      this.submitLoading = false;
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  saveHisAuthentication(attribs: {
    pwdAtHash: string | null;
    pwdAtInput: string;
    pwdResult: boolean;
  }, hasAccount?: string): void {
    this.openModalAlert(
      'ชื่อบัญชีผู้ใช้งาน หรือรหัสผ่านไม่ถูกต้อง',
      'กรุณาตรวจสอบชื่อบัญชีผู้ใช้งาน หรือรหัสผ่านของท่าน และลองใหม่อีกครั้ง'
    );
    this.authenService.saveHistoryAuth(attribs).subscribe(auth => {
      if(auth) {
        this.setObjectBlockRequest(auth, hasAccount);
      }
    });
  }

  setObjectBlockRequest(auth: {
    FindHistory: any[];
    PWD_LIMIT_WRONG: number; 
    PWD_LOCK_DURATION_MINUTES: number;
    isView?: boolean;
  }, hasAccount?: string) {
    this.limitBlockedAuthenWrong = auth?.PWD_LOCK_DURATION_MINUTES ?? 1440;
    this.limitPassWrong = auth?.PWD_LIMIT_WRONG ?? 0;
    this.authenHistory = auth?.FindHistory ?? [];

    if(this.authenBlocked == false && this.limitPassWrong > 0) {
      const count = this.authenHistory.length;
      const limit = this.limitPassWrong - count;
      if(limit <= 0) {
        this._setBlockAccount();
        if(hasAccount) {
          this.authenService.lockPwdByUuid({ pwdAtHash: hasAccount }).subscribe(res => {
          })
        }
      }else{
        if(auth?.isView != true) {
          this.authenMsgAlert = `คุณสามารถกรอกข้อมูลผิดได้อีก ${limit} ครั้ง`
        }
      }
    }
  }

  _setBlockAccount() {
    this.authenBlocked = true;
    this.authenMsgAlert = `ระบบได้ทำการระงับบัญชีของท่าน กรุณากดลืมรหัสผ่าน`;
  }

  //-- check version consent
  checkVersionConsent(token: string) {
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
  }

  //-- open drawer consent
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

  //-- save consent
  saveConsent(
    token: string,
    body: {
      ffdTargetConsentCode: string;
      ffdTargetConsentVersion: string;
      option: number;
    }
  ) {
    this.consentService.saveConsent(token, body).subscribe((res) => {
      this.actionRedirect();
    });
  }

  actionErrorApi() {
    this.notification.error('Error', 'server error');
  }

  //-- go to landing page
  actionRedirect() {
    this.router.navigate(['/']);
  }

  isOpenModal: boolean = false;
  modal = {
    title: '',
    message: ''
  }
  openModalAlert(title: string, message: string) {
    this.isOpenModal = true;
    this.modal.title = title;
    this.modal.message = message;
  }
}
