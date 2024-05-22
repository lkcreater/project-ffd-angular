import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';
import { IUserInfoData } from '../../stores/user-info/user-info.reducer';
import { CookieHelper } from '../../helpers/cookie.helper';
import {
  IInfoProfile,
  actionClaerUserInfo,
  actionLoadUserInfo,
} from '../../stores/user-info/user-info.actions';
import { map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiHelper } from '../../helpers/api.helper';
import { IApiResponse } from '../../core/interfaces';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private store: Store<{ userInfo: IUserInfoData<IInfoProfile> }>,
    private utilsService: UtilsService
  ) {}

  //-- get state user info
  getUserInfo() {
    return this.store.select('userInfo');
  }

  //-- set user info
  setUserInfo(token: string) {
    return this.http
      .get<IApiResponse<IInfoProfile>>('accounts', {
        headers: ApiHelper.header({ token }),
      })
      .pipe(
        map((res) => {
          //-- convert result
          const result = this.utilsService.handleResponse(res);

          //-- set token
          this.setToken(token);

          //-- set stored
          this.store.dispatch(
            actionLoadUserInfo({
              isLoad: true,
              isAuthenticated: true,
              userInfo: result,
            })
          );
          return result;
        })
      );
  }

  //-- set token
  setToken(token: string) {
    this.cookieService.set(CookieHelper.keyAuthen(), token, undefined, '/');
    return this.cookieService.check(CookieHelper.keyAuthen());
  }

  //-- get token
  getToken() {
    if (this.cookieService.check(CookieHelper.keyAuthen())) {
      return this.cookieService.get(CookieHelper.keyAuthen());
    }
    return null;
  }

  //-- logout and clear info
  logoutUserInfo() {
    this.cookieService.delete(CookieHelper.keyAuthen(), '/');
    this.store.dispatch(actionClaerUserInfo());
    return this.cookieService.check(CookieHelper.keyAuthen()) == false;
  }

  //-- update profile
  updateProfile(
    token: string,
    body: {
      accPicture?: any;
      accFirstname?: string;
      compCode?: string;
      updatedBy?: string;
    }
  ) {
    return this.http
      .put<
        IApiResponse<{
          generatedMaps: any[];
          raw: any[];
          affected: number;
        }>
      >('accounts/update-profile', body, {
        headers: ApiHelper.header({ token }),
      })
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }

  //-- fetch user info by cookie
  fetchUserInfo() {
    if (this.cookieService.check(CookieHelper.keyAuthen())) {
      const token = this.cookieService.get(CookieHelper.keyAuthen());
      return this.setUserInfo(token);
    }
    return of(null);
  }
}
