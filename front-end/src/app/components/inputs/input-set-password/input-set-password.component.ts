import { KeyValuePipe, NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BcryptHelper } from '../../../helpers/bcrypt.helper';

@Component({
  selector: 'app-input-set-password',
  standalone: true,
  imports: [
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzIconModule,
    KeyValuePipe,
    NgFor,
  ],
  templateUrl: './input-set-password.component.html',
  styleUrl: './input-set-password.component.scss',
})
export class InputSetPasswordComponent {

  @Output() onValid = new EventEmitter();

  constructor(private fb: NonNullableFormBuilder) {}

  conditionPassword = {
    condi_1: {
      check: false,
      label: 'จำเป็นต้องมีตัวอักษร a-z อย่างน้อยหนึ่งตัว',
      validator: this.checkValidatePatternRegx(/^(?=.*[a-z])/),
    },
    condi_2: {
      check: false,
      label: 'จำเป็นต้องมีตัวอักษร A-Z อย่างน้อยหนึ่งตัว',
      validator: this.checkValidatePatternRegx(/^(?=.*[A-Z])/),
    },
    condi_3: {
      check: false,
      label: 'จำเป็นต้องมีตัวอักษร 0-9 อย่างน้อยหนึ่งตัว',
      validator: this.checkValidatePatternRegx(/^(?=.*\d)/),
    },
    condi_4: {
      check: false,
      label: 'จำเป็นต้องมีตัวอักษรอย่างน้อย 8 ตัว',
      validator: this.checkValidatePatternRegx(/^[A-Za-z\d@$!%*?&#%^]{8,}$/),
    },
  };

  passwordValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return { error: true, message: 'กรุณากรอกรหัสผ่าน' };
    }

    let isNotValid = false;
    for (const [key, object] of Object.entries(this.conditionPassword)) {
      const isCheck = object.validator(control.value);
      if (isCheck == false) {
        isNotValid = true;
      }
      Object.assign(object, {
        check: isCheck,
      });
    }

    if (isNotValid) {
      return { error: true, message: 'กรุณากรอกรหัสผ่านให้ตรงเงื่อนไข' };
    }

    return {};
  };

  confirmPasswordValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return { error: true, message: 'กรุณากรอกยืนยันรหัสผ่าน' };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { error: true, message: 'ยืนยันรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบ' };
    }
    return {};
  };

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  validateForm: FormGroup<{
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }> = this.fb.group({
    password: ['', [this.passwordValidator]],
    confirmPassword: ['', [this.confirmPasswordValidator]],
  });

  checkValidatePatternRegx(regExp: RegExp) {
    return (password: string): boolean => {
      return regExp.test(password);
    };
  }

  actionSubmit() {
    if(this.validateForm.valid) {
      this.onValid.emit({
        ...this.validateForm.value,
        hash: BcryptHelper.hash(this.validateForm.controls.password.value) 
      });
      this.validateForm.reset();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
