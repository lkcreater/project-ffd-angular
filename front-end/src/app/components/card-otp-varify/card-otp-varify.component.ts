import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormControl,
  FormRecord,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  finalize,
  interval,
  map,
  Subscription,
  takeWhile,
} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { OtpService } from '../../services/otp/otp.service';
import { TextHelper } from '../../helpers/text.helper';
import { TChanelAuthen } from '../../core/interfaces';

const TIME_OTP = 60;

@Component({
  selector: 'app-card-otp-varify',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NzInputModule, NzFormModule],
  templateUrl: './card-otp-varify.component.html',
  styleUrl: './card-otp-varify.component.scss',
})
export class CardOtpVarifyComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input({ required: true }) type!: TChanelAuthen | string;
  @Input({ required: true }) input!: string;
  @Input({ required: true }) token!: string;
  @ViewChildren('refInput') private refInput!: QueryList<ElementRef>;
  @Output() onSubmit = new EventEmitter();

  constructor(
    private fb: NonNullableFormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private otpService: OtpService,
  ) {}

  ngOnInit(): void {
    const type = this.type as 'EMAIL' | 'PHONE';
    this.label = this.constrant[type];

    for (let index = 0; index < this.loopInput.length; index++) {
      this.listOfControl.push({
        id: index,
        controlInstance: `input_otp_${index}`,
      });
      this.validateForm.addControl(
        this.listOfControl[index].controlInstance,
        this.fb.control('', Validators.required)
      );
    }

    if (isPlatformBrowser(this.platformId)) {
      //-- requast otp
      this.sendingOtp();
    }
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (this.refInput) {
      this.refInput.first.nativeElement.focus();
    }
  }

  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  label: string = '';
  loopInput = new Array(6);
  constrant = {
    EMAIL: 'อีเมล',
    PHONE: 'เบอร์โทรศัพท์ SMS ',
  };

  timeSubscription!: Subscription;
  timeRemaining: number = TIME_OTP;
  timeCountdown: number = TIME_OTP;
  timeFinished: boolean = false;

  otpObjectRef = {
    code: '',
    secret: '',
    type: '',
  }

  setTimeOtp() {
    this.timeSubscription = interval(1000)
      .pipe(
        map((value) => {
          return this.timeRemaining - value - 1;
        }),
        takeWhile((value) => value >= 0),
        finalize(() => {
          this.otpObjectRef = {
            code: '',
            secret: '',
            type: '',
          };
          
          this.validateForm.disable();
          this.timeCountdown = TIME_OTP;
          this.timeFinished = true
        })
      )
      .subscribe((val) => {
        this.timeCountdown = val;
      });
  }

  sendingOtp() {
    this.otpService.sendOtpRequest(this.token, this.input).subscribe(res => {
      if(res) {
        this.otpObjectRef = res
        this.setTimeOtp();
      }
    });
  }

  resendOtp() {
    this.timeFinished = false;
    this.sendingOtp();
    this.resetForm();
  }

  displayInput() {
    let txt = '';

    if(['EMAIL', 'PHONE'].includes(this.type)) {
      txt = TextHelper.maskInput(this.type as 'EMAIL' | 'PHONE', this.input);
    }

    return txt;
  }

  onInputKey(data: any, idx: number) {
    if (this.refInput && data.inputType == 'insertText' && idx <= 5) {
      const key = idx + 1;
      this.validateForm.controls[`input_otp_${key}`]?.reset();
      this.refInput.get(key)?.nativeElement.focus();
      if (idx == 5 && this.validateForm.valid) {
        this.submitFrom();
      }
    }
  }

  onInputDel(data: any, idx: number) {
    if (this.refInput && data.key == 'Backspace' && idx > 0) {
      if (
        this.validateForm.controls[`input_otp_${idx}`].value == null ||
        this.validateForm.controls[`input_otp_${idx}`].value == ''
      ) {
        const key = idx - 1;
        this.validateForm.controls[`input_otp_${key}`]?.reset();
        this.refInput.get(key)?.nativeElement.focus();
      }
    }
  }

  resetForm() {
    if (this.validateForm.disabled) {
      this.validateForm.enable();
    }
    this.validateForm.reset();
    this.refInput.get(0)?.nativeElement.focus();
  }

  submitFrom() {
    if (this.validateForm.valid && !this.timeFinished) {
      this.validateForm.disable();
      const valuesArray = Object.values(this.validateForm.value);
      const value = valuesArray.join('');

      this.otpService.verifyOtp(this.token, {
        otp: value,
        secret: this.otpObjectRef.secret
      }).subscribe(res => {
        this.onSubmit.emit({
          verify: res?.isValid,
          secret: this.otpObjectRef.secret,
          otp: value
        });
        this.resetForm();
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
}
