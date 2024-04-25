import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { ApiHelper } from '../../helpers/api.helper';
import { map } from 'rxjs';
import { IApiResponse } from '../../core/interfaces';

export interface IDataConsent {
  consId: string;
  ffdBusinessConsentGroup: number;
  ffdExecutionApplication: number;
  ffdTargetConsentId: number;
  ffdTargetConsentCode: string;
  ffdTargetConsentVersion: string;
  ffdTargetProductType: any;
  ffdTargetConsentTopicThai: string;
  ffdTargetConsentTopicEnglish: string;
  ffdTargetConsentThai: string;
  ffdTargetConsentEnglish: string;
  ffdTargetConsentOptionThai: FfdTargetConsentOptionThai[];
  ffdTargetConsentOptionEnglish: FfdTargetConsentOptionEnglish[];
  ffdTargetPrivacyNoticeThai: string;
  ffdTargetPrivacyNoticeEnglish: string;
  ffdTheme: string;
  active: boolean;
  createdBy: any;
  updatedBy: any;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface FfdTargetConsentOptionThai {
  desc: string;
  option: number;
}

export interface FfdTargetConsentOptionEnglish {
  desc: string;
  option: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  checkVersion(token: string) {
    return this.http
      .post<IApiResponse<{ isAcceptConsent: boolean, message?: string }>>(
        ApiHelper.api('consent/version'),
        {},
        {
          headers: ApiHelper.header({ token }),
        }
      )
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }

  getConsent(token: string) {
    return this.http
      .get<IApiResponse<{ consent: IDataConsent }>>(
        ApiHelper.api('consent/get-consent'),
        {
          headers: ApiHelper.header({ token }),
        }
      )
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }

  saveConsent(
    token: string,
    body: {
      ffdTargetConsentCode: string;
      ffdTargetConsentVersion: string;
      option: number;
    }
  ) {
    return this.http
      .post<
        IApiResponse<{
          save: boolean;
          ffdTargetConsentCode: string;
          ffdTargetConsentVersion: string;
          option: number;
        }>
      >(ApiHelper.api('consent/save-consent'), body, {
        headers: ApiHelper.header({ token }),
      })
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }
}
