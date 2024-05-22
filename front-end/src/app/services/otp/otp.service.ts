import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../../helpers/api.helper';
import { UtilsService } from '../utils/utils.service';
import { map } from 'rxjs';
import { IApiResponse } from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  //-- request OTP
  sendOtpRequest(token: string, input: string) {
    return this.http.post<IApiResponse<{
      code: string;
      secret: string;
      type: string;
    }>>(ApiHelper.api('require/sent-otp'), {
      action: 'OTP',
      input: input
    }, {
      headers: ApiHelper.header({ token })
    })
    .pipe(map(res => this.utilsService.handleResponse(res)));
  }

  //-- verify OTP
  verifyOtp(token: string, body: { otp: string; secret: string; }) {
    return this.http.post<IApiResponse<{
      isValid: boolean;
      response_ref: string;
      response_datetime: string;
      response_code: string | number;
      response_desc: string;
    }>>(ApiHelper.api('require/verify-otp'), {
      otp: body.otp,
      token_uuid: body.secret
    }, {
      headers: ApiHelper.header({ token })
    })
    .pipe(map(res => this.utilsService.handleResponse(res)));
  }

  //-- save his OTP
  saveHisOtp(body: { 
    otpHisAction: string;
    otpHisType: string;
    otpHisInput: string;
    otpHisSecret: string;
    otpHisPac: string;
    otpHisIsValid: boolean | null;
  }) {
    return this.http.post<IApiResponse<{
      FindHistory: any[];
      MAX_OTP_REQUESTS: number;
      BLOCK_DURATION_MINUTES: number;
      OTP_LIMIT_WRONG: number;
    }>>(ApiHelper.api('require/save-history-otp'), body)
    .pipe(map(res => this.utilsService.handleResponse(res)));
  }

  //-- get his OTP
  getHisOtp(body: { 
    otpHisAction: string;
    otpHisType: string;
    otpHisInput: string;
  }) {
    return this.http.post<IApiResponse<{
      FindHistory: any[];
      MAX_OTP_REQUESTS: number;
      BLOCK_DURATION_MINUTES: number;
      OTP_LIMIT_WRONG: number;
    }>>(ApiHelper.api('require/history-otp'), body)
    .pipe(map(res => this.utilsService.handleResponse(res)));
  }
}
