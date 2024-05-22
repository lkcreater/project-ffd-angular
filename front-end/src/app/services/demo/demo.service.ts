import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { IApiResponse } from '../../core/interfaces';
import { ApiHelper } from '../../helpers/api.helper';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  //-- login demo verify
  demoCheck(userName: string) {
    return this.http
      .post<IApiResponse<any>>(ApiHelper.api('demo/check'), {
        userName,
      })
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }

  //-- login demo
  demoLogin(userName: string) {
    return this.http
      .post<IApiResponse<any>>(ApiHelper.api('demo'), {
        userName,
      })
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }
}
