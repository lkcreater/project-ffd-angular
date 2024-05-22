import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse } from '../../core/interfaces';
import { map, of } from 'rxjs';
import { UtilsService } from '../utils/utils.service';
import { ApiHelper } from '../../helpers/api.helper';
import { BcryptHelper } from '../../helpers/bcrypt.helper';

@Injectable({
  providedIn: 'root',
})
export class AuthenService {
    
  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  //-- login verify
  singInVerify(userName: string, passWord: string) {
    return this.http.post<
      IApiResponse<{
        hash: string;
        secretKey: string;
        status?: string;
      }>
    >(ApiHelper.api('authen'), {
      action: 'FFD_AUTHEN',
      userName,
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  //-- confirm secret key
  singInConfirmSecret(userName: string, passWord: string, hash: string, secretKey: string) {
    const isCompare = BcryptHelper.compareHash(passWord, hash);
    if(!isCompare) {
      return of(null);
    }

    const verHash = BcryptHelper.verifyHash(secretKey);
    return this.http.post<
      IApiResponse<{
        isLineConnect: boolean;
        token: string;
      }>
    >(ApiHelper.api('authen'), {
      action: 'AUTHEN_CONFIRM',
      userName,
      passWord: verHash,
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  //-- verify EMAIL / PHONE
  verifyInput(input: string) {
    return this.http.post<
      IApiResponse<{
        isExistAlready: boolean;
        token: string;
        type: string;
      }>
    >(ApiHelper.api('require/verify-input'), {
      action: 'VERIFY',
      token: 'show',
      input: input,
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  //-- create account
  createEmailOrPhone(token: string, body: {
    userName: string;
    passWord: string;
    condiVersion: string | null;
    option: number | null;
  }) {
    return this.http.post<
      IApiResponse<{
        token: string;
      }>
    >(ApiHelper.api('authen/create-account'), {
      action: 'CREATE_ACCOUNT',
      ...body
    }, {
      headers: ApiHelper.header({ token })
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  forgotPassword(token: string, newPassword: string) {
    return this.http.put<
      IApiResponse<{
        isExistAlready: boolean;
        token: string;
        type: string;
      }>
    >(ApiHelper.api('accounts/forgot-pwd'), {
      accPassword: newPassword
    }, {
      headers: ApiHelper.header({ token })
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  getListPwd(token: string) {
    return this.http.get<
      IApiResponse<{
        history: any[];
      }>
    >(ApiHelper.api('history-pwd'), {
      headers: ApiHelper.header({ token })
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  saveHistoryAuth(body: {
    pwdAtHash: string | null;
    pwdAtInput: string;
    pwdResult: boolean;
  }) {
    return this.http.post<
      IApiResponse<{
        FindHistory: any[];
        PWD_LIMIT_WRONG: number; 
        PWD_LOCK_DURATION_MINUTES: number;
      }>
    >(ApiHelper.api('history-pwd/save-activity'), body).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  getHistoryAuth(body: {
    pwdAtInput: string;
  }) {
    return this.http.post<
      IApiResponse<{
        FindHistory: any[];
        PWD_LIMIT_WRONG: number; 
        PWD_LOCK_DURATION_MINUTES: number;
      }>
    >(ApiHelper.api('history-pwd/get-activity'), body).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  lockPwdByUuid(body: {
    pwdAtHash: string;
  }) {
    return this.http.put<
      IApiResponse<{
        FindHistory: any[];
        PWD_LIMIT_WRONG: number; 
        PWD_LOCK_DURATION_MINUTES: number;
      }>
    >(ApiHelper.api('history-pwd/lock-activity'), body).pipe(map(res => this.utilsService.handleResponse(res)));
  }
  
}
