import { createAction, props } from '@ngrx/store';
import { ITermConditionData } from './term-condition.reducer';

export enum ETermConditionAction {
  LOAD = '[term condition] set term condition loading',
}

export const actionLoadTermCondition = createAction(
  ETermConditionAction.LOAD,
  props<{ data: ITermConditionData | null }>()
);
