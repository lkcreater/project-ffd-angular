import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-input-change-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
  ],
  templateUrl: './input-change-profile.component.html',
  styleUrl: './input-change-profile.component.scss',
})
export class InputChangeProfileComponent {
  validateForm: FormGroup<{
    fieldName: FormControl<string>;
  }> = this.fb.group({
    fieldName: ['', [Validators.required]],
  });

  @Input() id!: string;
  @Input() input: string = '';
  @Input() label: string = '';
  @Output() onChange = new EventEmitter();

  isUpdate: boolean = false;

  constructor(private fb: NonNullableFormBuilder) {
    this.validateForm.controls.fieldName.setValue(this.input);
    this.validateForm.get('fieldName')?.disable();
  }

  btnAction() {
    this.isUpdate = !this.isUpdate;
    if (this.isUpdate) {
      if(this.input) {
        this.validateForm.controls.fieldName.setValue(this.input);
      }
      this.validateForm.get('fieldName')?.enable();
    } else {
      this.validateForm.get('fieldName')?.disable();
    }
  }

  submitForm() {
    if (this.validateForm.valid) {
      this.btnAction();
      this.input = this.validateForm.value.fieldName ?? ''
      this.onChange.emit(this.validateForm.value);
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
