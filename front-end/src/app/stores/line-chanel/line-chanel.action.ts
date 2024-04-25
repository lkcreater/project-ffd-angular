import { createAction, props } from '@ngrx/store';

export enum ELineChanelAction {
  LOAD = '[line chanel] load data',
}

export const actionLoadLineChanel = createAction(
  ELineChanelAction.LOAD,
  props<{ lineChanel: any[] }>()
);
