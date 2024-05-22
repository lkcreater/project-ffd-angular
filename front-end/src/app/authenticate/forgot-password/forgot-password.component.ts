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
import { ModalAlertComponent } from '../../components/modal-alert/modal-alert.component';

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
    InputSetPasswordComponent,
    ModalAlertComponent
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

  historyPwds: any[] = [];

  stepNext: 'input' | 'otp' | 'password' = 'input';
  inputObject = {
    input: '',
    isExistAlready: true,
    token: '',
    type: 'EMAIL',
  };

  submitForm(): void {
    //-- step input
    if (this.stepNext == 'input') {
      if (this.validateForm.valid && this.validateForm.value.userName) {
        let inputData = this.validateForm.value.userName;
        const input = inputData.toLowerCase();
        this.authenService.verifyInput(input).subscribe((res) => {
          const token = res?.token;
          if(token) {
            this.authenService.getListPwd(token).subscribe(res => {
              this.historyPwds = res?.history ?? [];
            });
          }

          if (res?.isExistAlready == true) {
            this.inputObject = {
              input: input,
              ...res,
            };
            this.stepNext = 'otp';
          } else {
            this.openModalAlert(
              'บัญชีผู้ใช้ของท่านไม่ถูกต้อง',
              'กรุณาใส่ เบอร์โทรศัพท์ / อีเมล ของท่านเพื่อรับขั้นตอน การเปลี่ยนรหัสผ่านใหม่อีกครั้ง'
            );
            this.validateForm.reset();
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
      this.stepNext = 'password';
    } else {
      this.openModalAlert(
        'รหัส OTP ไม่ถูกต้อง',
        'กรุณากรอกรหัส OTP ใหม่อีกครั้ง'
      );
    }
  }

  //-- step new password
  onNewPassword(data: {
    password: string;
    confirmPassword: string;
    hash: string;
  }) {
    this.authenService
      .forgotPassword(this.inputObject.token, data.hash)
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/auth']);
        }
      });
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
