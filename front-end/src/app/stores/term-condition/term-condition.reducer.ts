import { createReducer, on } from '@ngrx/store';
import { actionLoadTermCondition } from './term-condition.action';

export interface ITermConditionData {
  condiId: number
  condiTopic: string
  condiVersion: string
  condiText: string
  condiPrivacyNotice: string
  condiOption: ICondiOption[]
  active: boolean
  createdBy: string
  updatedBy: string
  createdDatetime: string
  updatedDatetime: string
}

export interface ICondiOption {
  desc: string
  option: number
}

export const initialState: { data: ITermConditionData | null } = {
  data: null,
};

export const termConditionReducer = createReducer<{ data: ITermConditionData | null }>(
  initialState,
  on(actionLoadTermCondition, (state, payload) => {
    return {
      ...state,
      data: payload.data
    };
  })
);
