import { createAction, props } from '@ngrx/store';

export enum EQuestionnaireAction {
  LOAD = '[questionnaire] load data',
}

export const actionLoadQuestionnaire = createAction(
  EQuestionnaireAction.LOAD,
  props<any>()
);
