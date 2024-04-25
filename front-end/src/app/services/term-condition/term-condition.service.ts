import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITermConditionData } from '../../stores/term-condition/term-condition.reducer';
import { map } from 'rxjs';
import { ApiHelper } from '../../helpers/api.helper';
import { UtilsService } from '../utils/utils.service';
import { IApiResponse } from '../../core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TermConditionService {
  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    private store: Store<{ termCondition: { data: ITermConditionData | null } }>
  ) {}

  saveTermConditionAction(
    token: string,
    body: { condiVersion: string; option: number }
  ) {
    return this.http
      .post<
        IApiResponse<{
          saveCondition: boolean;
          token: string;
        }>
      >(ApiHelper.api('term/action'), body, {
        headers: ApiHelper.header({ token }),
      })
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }

  getTermCondition() {
    return this.store.select('termCondition');
  }

  fetchTermCondition() {
    return this.http
      .get<IApiResponse<ITermConditionData>>(ApiHelper.api('term'))
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }
}
