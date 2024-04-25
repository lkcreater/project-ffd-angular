import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { AuthenService } from '../../services/authen/authen.service';
import { CardOtpVarifyComponent } from '../../components/card-otp-varify/card-otp-varify.component';
import { InputSetPasswordComponent } from '../../components/inputs/input-set-password/input-set-password.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    RouterLink,
    CardContentComponent,
    CardOtpVarifyComponent,
    InputSetPasswordComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  @ViewChild(CardOtpVarifyComponent)
  cardOtpVarifyComponent!: CardOtpVarifyComponent;
  @ViewChild(InputSetPasswordComponent)
  inputSetPasswordComponent!: InputSetPasswordComponent;

  constructor(
    private fb: NonNullableFormBuilder,
    private notification: NzNotificationService,
    private authenService: AuthenService,
    private router: Router
  ) {}

  validateForm: FormGroup<{
    userName: FormControl<string>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
  });

  stepNext: 'input' | 'otp' | 'password' = 'input';
  inputObject = {
    input: '',
    isExistAlready: true,
    token: '',
    type: 'EMAIL'
  }

  submitForm(): void {
    //-- step input
    if (this.stepNext == 'input') {
      if (this.validateForm.valid && this.validateForm.value.userName) {
        let input = this.validateForm.value.userName;
        this.authenService.verifyInput(input).subscribe(res => {
          if(!res) {
            this.notification.warning('Error', 'error api validation');
          }

          if(res?.isExistAlready == true) {
            this.inputObject = {
              input: input,
              ...res
            }
            this.stepNext = 'otp';
          }else{
            this.notification.warning('แจ้งเตือน', 'บัญชีผู้ใช้ของท่านไม่ถูกต้อง กรุณาตรวจสอบ');
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
  }

  //-- step OTP
  onOtpSubmit(data: { verify: boolean; secret: string; otp: string }) {
    if (data?.verify == true) {
      this.stepNext = 'password'
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
        'ระบบเกิดข้อผิดพลาด'
      );
    }

    this.authenService.forgotPassword(this.inputObject.token, data.hash).subscribe(res => {
      console.log(res);
      if(res) {
        this.router.navigate(['/auth']);
      }
    })
  }
}
