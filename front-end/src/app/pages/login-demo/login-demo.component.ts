import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { DemoService } from '../../services/demo/demo.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CookieHelper } from '../../helpers/cookie.helper';

@Component({
  selector: 'app-login-demo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    CardContentComponent,
  ],
  templateUrl: './login-demo.component.html',
  styleUrl: './login-demo.component.scss',
})
export class LoginDemoComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private demoService: DemoService,
    private modal: NzModalService,
    private userInfoService: UserInfoService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  logoImage = './assets/icons/icon-signup.png';

  customValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return { error: true, message: 'กรุณากรอกชื่อผู้ใช้ ' };
    } else if (control.value) {
      let regex = /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

      if (!regex?.test(control.value)) {
        return {
          error: true,
          message: 'กรุณากรอกรูปแบบชื่อผู้ใช้ให้ถูกต้อง',
        };
      } else {
        return null;
      }
    }
    return {};
  };

  validateForm: FormGroup<{
    userName: FormControl<string>;
  }> = this.fb.group({
    userName: ['', [this.customValidator]],
  });

  submitNextForm() {
    if (this.validateForm.valid) {
      const input = this.validateForm.value.userName ?? '';

      this.demoService.demoCheck(input).subscribe((res) => {
        if (res?.verify == true) {
          this.modalCheck(input);
        } else {
          this.demoLogin(input);
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

  modalCheck(userName: string): void {
    this.modal.confirm({
      nzTitle: 'บัญชีนี้ถูกใช้งานแล้ว ท่านต้องการใช้บัญชีนี้ ใช่หรือไม่',
      nzOnOk: () => this.demoLogin(userName),
      nzOnCancel: () => this.validateForm.reset(),
    });
  }

  demoLogin(userName: string) {
    this.demoService.demoLogin(userName).subscribe((res) => {
      if (res.token) {
        this.userInfoService.setToken(res.token);
        this.userInfoService.fetchUserInfo().subscribe();
        this.router.navigate(['']);
      }
    });
  }
}
