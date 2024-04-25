import { createReducer, on } from '@ngrx/store';
import { actionLoadConfig } from './config.action';

export interface IConfiglData<T = unknown> {
  isLoad: boolean;
  data: T;
}

export const initialStateData: IConfiglData = {
  isLoad: false,
  data: null,
};

export const configReducer = createReducer<IConfiglData>(
  initialStateData,
  on(actionLoadConfig, (state, payload) => {
    return {
      ...state,
      isLoad: true,
      data: payload,
    };
  })
);
