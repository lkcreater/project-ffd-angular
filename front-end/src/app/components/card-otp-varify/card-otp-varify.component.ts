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
import { NzAlertModule } from 'ng-zorro-antd/alert';
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
import { ModalAlertComponent } from '../modal-alert/modal-alert.component';

const TIME_OTP = 60; //-- 60 seconds
const HIT_TYPE_VERIFY = 'VERIFY';
const HIT_TYPE_REQEUST = 'REQEUST';
const HIT_TYPE_ALL = 'ALL';

@Component({
  selector: 'app-card-otp-varify',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NzInputModule, NzFormModule, NzAlertModule, ModalAlertComponent],
  templateUrl: './card-otp-varify.component.html',
  styleUrl: './card-otp-varify.component.scss',
})
export class CardOtpVarifyComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input({ required: true }) typeOtp!: string;
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
      this.otpService.getHisOtp({
        otpHisAction: HIT_TYPE_ALL,
        otpHisType: this.typeOtp,
        otpHisInput: this.input,
      }).subscribe(res => {
        if(res) {
          this.setObjectHistory(HIT_TYPE_VERIFY, res, true);
          this.setObjectHistory(HIT_TYPE_REQEUST, res, true);

          //-- requast otp
          if(this.otpIsBlock == false && this.otpIsBlockRequest == false) {
            this.sendingOtp();
          }
        }
      })
      
    }
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (this.refInput && this.otpIsBlock == false) {
      this.refInput.first.nativeElement.focus();
    }
  }

  isFirstRequestOtp: boolean = true;

  //-- configure otp
  otpLimitWrong: number = 0;
  otpMaxRequest: number = 0;
  otpBlockDulationTime: number = 15;
  otpHistory: Record<string, any[]> = {};
  otpWarningMsg!: string;
  otpBlockMsg!: string;
  otpRequestMsg!: string; 
  otpAlertMsg!: string;
  otpIsBlock: boolean = false; //-- block verify
  otpIsBlockRequest: boolean = false; //-- block request

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
  isFirstRenderBlockRequest: boolean = false;

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
        this.saveHistoryOtp(HIT_TYPE_REQEUST);
        this.setTimeOtp();
      }
    });
  }

  resendOtp() {
    //-- reset request otp
    this.otpWarningMsg = '';


    this.revokeOtp(this.otpObjectRef);
    this.isFirstRequestOtp = false;
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
    if (this.validateForm.valid) {
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

        if(res?.isValid == true) {
          this.revokeOtp(this.otpObjectRef);
        }

        //-- save history
        this.saveHistoryOtp(HIT_TYPE_VERIFY, res?.isValid);

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

  saveHistoryOtp(action: string, isValid: boolean | null = null) {
    this.otpService.saveHisOtp({
      otpHisAction: action,
      otpHisType: this.typeOtp,
      otpHisInput: this.input,
      otpHisSecret: this.otpObjectRef.secret,
      otpHisPac: this.otpObjectRef.code,
      otpHisIsValid: isValid,
    }).subscribe(his => {
      if(his){
        this.setObjectHistory(action, his);
      }
    });
  }

  setObjectHistory(action: string, response: {
    FindHistory: any[];
    MAX_OTP_REQUESTS: number;
    BLOCK_DURATION_MINUTES: number;
    OTP_LIMIT_WRONG: number;
  }, isView: boolean = false) {
    this.otpHistory[action] = response?.FindHistory ?? [];
    this.otpMaxRequest = response?.MAX_OTP_REQUESTS ?? 0;
    this.otpLimitWrong = response?.OTP_LIMIT_WRONG ?? 0; //-- กรอกผิดลิมิต
    this.otpBlockDulationTime = response?.BLOCK_DURATION_MINUTES ?? 15;

    //-- verify wrong
    if(action == HIT_TYPE_VERIFY && this.otpHistory[action].length > 0 && this.otpLimitWrong > 0) {
      console.log(HIT_TYPE_VERIFY);
      
      const otp_secret = this.otpObjectRef?.secret;
      let limitVerified = 0;
      response?.FindHistory?.forEach(history => {
        if(history?.otpHis_otp_his_secret == otp_secret) {
          limitVerified++;
        }
      });

      const verifyCountAllowed = this.otpLimitWrong - limitVerified;
      if(isView == false) {
        this.otpWarningMsg = `คุณสามารถตรวจสอบ OTP ของคุณได้อีก ${verifyCountAllowed} ครั้ง`;
      }

      if(verifyCountAllowed <= 0) {
        this.otpIsBlock = true;
        this.otpBlockMsg = `ระบบทำการบล็อกคุณ ${this.otpBlockDulationTime} นาที เนื่องจากกรอก OTP ผิดเกินจำนวนที่กำหนด`;
      }else{
        this.otpIsBlock = false;
      }
    }

    //-- request otp
    if(action == HIT_TYPE_REQEUST && this.otpHistory[action].length > 0 && this.otpMaxRequest > 0) {
      let limitRequest = 0;
      response?.FindHistory?.forEach(history => {
        if(history?.otpHis_otp_his_action == HIT_TYPE_REQEUST) {
          limitRequest++;
        }
      });

      const requestCountLimit = this.otpMaxRequest - limitRequest;
      this.otpRequestMsg = `สามารถขอ OTP ได้อีก ${requestCountLimit} ครั้ง`;
      if(requestCountLimit <= 0) {
        this.otpIsBlockRequest = true;
        this.otpRequestMsg = `คุณถูกระงับการขอ OTP เป็นเวลา ${this.otpBlockDulationTime} นาที`;
      } 

      if(isView && this.otpIsBlockRequest) {
        this.isFirstRenderBlockRequest = true;
      }
    }

    if(this.otpIsBlock) {
      this.otpAlertMsg = this.otpBlockMsg;
    }

    if(this.otpIsBlockRequest) {
      this.otpAlertMsg = this.otpRequestMsg;
    }
  }

  revokeOtp(key: any) {
    //console.log('revoke --> ', key);
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
