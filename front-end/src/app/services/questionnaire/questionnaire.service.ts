import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Store } from '@ngrx/store';
import { IQuestionnaireData } from '../../stores/questionnaire/questionnaire.reducer';
import { IApiResponse } from '../../core/interfaces';
import { ApiHelper } from '../../helpers/api.helper';
import { map } from 'rxjs';
import { actionLoadQuestionnaire } from '../../stores/questionnaire/questionnaire.action';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    private store: Store<{ questionnaire: IQuestionnaireData }>
  ) {}

  getQuestionnaire() {
    return this.store.select('questionnaire');
  }

  fetchQuestionnaireToStrore(token: string) {
    return this.http
      .get<IApiResponse<IQuestionnaireData>>(ApiHelper.api('health-check'), {
        headers: ApiHelper.header({ token }),
      })
      .pipe(
        map((res) => this.utilsService.handleResponse(res)),
        map((data) => {
          this.store.dispatch(actionLoadQuestionnaire(data));
          return data;
        })
      );
  }

  saveQuestionnaire(
    token: string,
    body: {
      hcHisSystem: any;
      hcHisAnswer: any;
      hcTypeRule: string;
      hcScoreInitil: number;
      hcHisScore: number;
    }
  ) {
    return this.http
      .post<
        IApiResponse<{
          peronaIcon: any;
        }>
      >(ApiHelper.api('health-check/save-answer'), body, {
        headers: ApiHelper.header({ token }),
      })
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }
}
