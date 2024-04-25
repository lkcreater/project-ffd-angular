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
    }>>(ApiHelper.api('require/verify-otp'), body, {
      headers: ApiHelper.header({ token })
    })
    .pipe(map(res => this.utilsService.handleResponse(res)));
  }
}
