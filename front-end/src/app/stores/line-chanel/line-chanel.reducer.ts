import { createReducer, on } from '@ngrx/store';
import { actionLoadLineChanel } from './line-chanel.action';

export interface ILineChanelData<T = unknown> {
  isLoad: boolean;
  data: T;
}

export const initialStateLineChanel: ILineChanelData = {
  isLoad: false,
  data: null,
};

export const lineChanelReducer = createReducer<ILineChanelData>(
  initialStateLineChanel,
  on(actionLoadLineChanel, (state, payload) => {
    return {
      ...state,
      isLoad: true,
      data: payload,
    };
  })
);
