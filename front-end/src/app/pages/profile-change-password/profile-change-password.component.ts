import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TChanelAuthen } from '../../core/interfaces';
import { CardOtpVarifyComponent } from '../../components/card-otp-varify/card-otp-varify.component';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { InputSetPasswordComponent } from '../../components/inputs/input-set-password/input-set-password.component';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { ProfileService } from '../../services/profile/profile.service';
import { IInfoProfile } from '../../stores/user-info/user-info.actions';

interface IStateObjectChangePassword {
  type: TChanelAuthen;
  input: string;
}

@Component({
  selector: 'app-profile-change-password',
  standalone: true,
  imports: [
    RouterLink,
    InputSetPasswordComponent,
    CardOtpVarifyComponent,
    CardContentComponent,
  ],
  templateUrl: './profile-change-password.component.html',
  styleUrl: './profile-change-password.component.scss'
})
export class ProfileChangePasswordComponent implements OnInit {
  @ViewChild(CardOtpVarifyComponent)
  cardOtpVarifyComponent!: CardOtpVarifyComponent;
  @ViewChild(InputSetPasswordComponent)
  inputSetPasswordComponent!: InputSetPasswordComponent;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NzNotificationService,
    private router: Router,
    private userInfoService: UserInfoService,
    private profileService: ProfileService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.stateObject = this.router.getCurrentNavigation()?.extras.state as IStateObjectChangePassword;
      if(!this.stateObject) {
        this.notification.create(
          'warning',
          'แจ้งเตือน',
          'route is wrong.'
        );
        this.router.navigate(['/profile']);
      }
    }
  }

  ngOnInit(): void {
    this._token = this.userInfoService.getToken();
    if(this._token) {
      this.inputObject.input = this.stateObject.input;
      this.inputObject.type = this.stateObject.type;
      this.inputObject.token = this._token;
    }
  }

  //-- private state 
  _token!: string | null;

  //-- public state
  stateObject!: IStateObjectChangePassword;
  stepNext: 'otp' | 'password' | 'success' = 'otp';
  successImage = './assets/success/success.png';

  userInfo!: IInfoProfile;
  inputObject = {
    input: '',
    isExistAlready: true,
    token: '',
    type: 'EMAIL',
  }

  //-- step OTP
  onOtpSubmit(data: { verify: boolean; secret: string; otp: string }) {
    if (data.verify) {
      this.stepNext = 'password';
    } else {
      this.notification.warning(
        'แจ้งเตือน',
        'การตรวจสอบ OTP ของท่านไม่ถูกต้อง'
      );
    }
  }

  //-- step new password
  onNewPassword(data: { password: string; confirmPassword: string; hash: string }) {
    if(!this.inputObject.token) {
      this.notification.warning(
        'แจ้งเตือน',
        'เกิดข้อผิดพลาดจากระบบ'
      );
    }

    this.onSubmitSuccess(data.hash);
  }

  //-- step info
  onSubmitSuccess(hash: string) {
    if(this._token){
      this.profileService.changePassword(this._token, hash).subscribe(res => {
        if (res && this._token) {
          this.userInfoService.setUserInfo(this._token).subscribe(userInfo => {
            if(userInfo){
              this.stepNext = 'success';
              this.notification.success(
                'แจ้งเตือน',
                'บันทึกข้อมูลผู้ใช้สำเร็จ'
              );
              setTimeout(() => {
                this.router.navigate(['/profile']);
              }, 1000);
            }
          });
        } else {
          this.notification.warning(
            'แจ้งเตือน',
            'การบันทึกข้อมูลผู้ใช้งานเกิดข้อผิดพลาด'
          );
        }
      })
    }
  }

  submitNextForm() {
    //-- step otp
    if (this.stepNext == 'otp') {
      this.cardOtpVarifyComponent?.submitFrom();
    }

    //-- step new password
    if (this.stepNext == 'password') {
      this.inputSetPasswordComponent.actionSubmit();
    }
  }
}
