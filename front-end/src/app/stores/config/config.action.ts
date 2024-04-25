import { createAction, props } from '@ngrx/store';

export enum EConfigAction {
  LOAD = '[config] load data',
}

export const actionLoadConfig= createAction(
  EConfigAction.LOAD,
  props<any>()
);
