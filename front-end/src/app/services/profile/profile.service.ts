import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../../helpers/api.helper';
import { UtilsService } from '../utils/utils.service';
import { IApiResponse, TChanelAuthen } from '../../core/interfaces';
import { map } from 'rxjs';
import { ILoginChanel } from '../../stores/user-info/user-info.actions';

export interface IBodyUpdateProfile {
  accPicture?: object;
  compCode?: string;
  accFirstname?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  changePassword(token: string, hash: string) {
    return this.http.put<
      IApiResponse<{
        isConnected: boolean;
        connect: any;
      }>
    >(ApiHelper.api('accounts/forgot-pwd'), { 
      accPassword: hash
    }, {
      headers: ApiHelper.header({ token })
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  updateProfile(token: string, body: IBodyUpdateProfile) {
    return this.http.put<
      IApiResponse<{
        isConnected: boolean;
        connect: any;
      }>
    >(ApiHelper.api('accounts/update-profile'), body, {
      headers: ApiHelper.header({ token })
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  connectAccount(token: string, body: { loginData: string; loginPlatform: TChanelAuthen; lineClientId?: string; accPassword?: string }) {
    
    let object = body;
    if(body?.accPassword) {
      Object.assign(object, {
        isNewPW: 'save'
      });
    }

    return this.http.post<
      IApiResponse<{
        isConnected: boolean;
        connect: any;
      }>
    >(ApiHelper.api('accounts/connect'), object, {
      headers: ApiHelper.header({ token })
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }

  disconnectAccount(token: string, chanelId: number) {
    return this.http.post<
      IApiResponse<{
        isClearPassword: boolean;
        chanelLogins: ILoginChanel[];
      }>
    >(ApiHelper.api('accounts/disconnect'), { 
      chanelId
    }, {
      headers: ApiHelper.header({ token })
    }).pipe(map(res => this.utilsService.handleResponse(res)));
  }
}
