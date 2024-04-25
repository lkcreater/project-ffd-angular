import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router, RouterLink } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { CardOtpVarifyComponent } from '../../components/card-otp-varify/card-otp-varify.component';
import { InputSetPasswordComponent } from '../../components/inputs/input-set-password/input-set-password.component';
import { InputInfoProfileComponent } from '../../components/inputs/input-info-profile/input-info-profile.component';
import { isPlatformBrowser } from '@angular/common';
import { AuthenService } from '../../services/authen/authen.service';
import { TChanelAuthen } from '../../core/interfaces';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { IInfoProfile } from '../../stores/user-info/user-info.actions';

export interface IStateObject {
  term: { condiVersion: string; option: number } | null;
  type: TChanelAuthen;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    RouterLink,
    InputInfoProfileComponent,
    InputSetPasswordComponent,
    CardOtpVarifyComponent,
    CardContentComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  @ViewChild(CardOtpVarifyComponent)
  cardOtpVarifyComponent!: CardOtpVarifyComponent;
  @ViewChild(InputSetPasswordComponent)
  inputSetPasswordComponent!: InputSetPasswordComponent;
  @ViewChild(InputInfoProfileComponent)
  inputInfoProfileComponent!: InputInfoProfileComponent;

  constructor(
    private fb: NonNullableFormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authenService: AuthenService,
    private userInfoService: UserInfoService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.stateObject = this.router.getCurrentNavigation()?.extras
        .state as IStateObject;
      if (!this.stateObject) {
        this.notification.create('warning', 'แจ้งเตือน', 'route is wrong.');
        this.router.navigate(['/auth/chanel']);
      }
    }

    //////-- mock data
    // this.stateObject = {
    //   term: { condiVersion: '0.0.1', option: 1 },
    //   type: 'PHONE',
    // };
  }

  ngOnInit(): void {
    this.type = this.stateObject?.type as 'EMAIL' | 'PHONE';
    this.label = this.constrant[this.type] ?? '';
  }

  logoImage = './assets/icons/icon-signup.png';
  successImage = './assets/success/success.png';
  constrant = {
    EMAIL: 'อีเมล',
    PHONE: 'เบอร์โทรศัพท์',
  };
  stateObject!: IStateObject;
  type!: 'EMAIL' | 'PHONE';
  label: string = '';
  stepNext: 'input' | 'otp' | 'password' | 'info' | 'success' = 'input';

  validateForm: FormGroup<{
    userName: FormControl<string>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
  });

  userInfo!: IInfoProfile;
  inputObject = {
    input: '',
    isExistAlready: true,
    token: '',
    type: 'EMAIL',
  };

  setupInput(object: object) {
    this.inputObject = {
      ...this.inputObject,
      ...object,
    };
  }

  submitNextForm(): void {
    //-- step input
    if (this.stepNext == 'input') {
      if (this.validateForm.valid) {
        const input = this.validateForm.controls.userName.value;
        this.authenService.verifyInput(input).subscribe((res) => {
          if (res && res.isExistAlready == false) {
            this.setupInput({
              input: input,
              ...res,
            });
            this.stepNext = 'otp';
          } else if (res && res.isExistAlready == true) {
            this.notification.warning(
              'แจ้งเตือน',
              'บัญชีนี้ถูกใช้งานแล้ว กรุณาลองใหม่'
            );
          }
        });
      } else {
        Object.values(this.validateForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }

    //-- step otp
    if (this.stepNext == 'otp') {
      this.cardOtpVarifyComponent?.submitFrom();
    }

    //-- step new password
    if (this.stepNext == 'password') {
      this.inputSetPasswordComponent.actionSubmit();
    }

    if (this.stepNext == 'info') {
      this.inputInfoProfileComponent.actionSubmit();
    }
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
  onNewPassword(data: {
    password: string;
    confirmPassword: string;
    hash: string;
  }) {
    if (!this.inputObject.token) {
      this.notification.warning('แจ้งเตือน', 'เกิดข้อผิดพลาดจากระบบ');
    }

    this.authenService
      .createEmailOrPhone(this.inputObject.token, {
        userName: this.inputObject.input,
        passWord: data.hash,
        condiVersion: this.stateObject.term?.condiVersion ?? null,
        option: this.stateObject.term?.option ?? null,
      })
      .subscribe((res) => {
        if (res?.token) {
          this.inputObject.token = res?.token;
          this.userInfoService.setUserInfo(res.token).subscribe((user) => {
            if (user) {
              this.userInfo = user;
              this.stepNext = 'info';
            }
          });
        }
      });
  }

  //-- step info
  onSubmitUserInfo(data: { status: boolean; updated: any }) {
    if (data.status) {
      this.stepNext = 'success';
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } else {
      this.notification.warning(
        'แจ้งเตือน',
        'การบันทึกข้อมูลผู้ใช้งานเกิดข้อผิดพลาด'
      );
    }
  }
}
