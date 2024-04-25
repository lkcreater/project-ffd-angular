import { createReducer, on } from '@ngrx/store';
import { actionClaerUserInfo, actionLoadUserInfo } from './user-info.actions';

export interface IUserInfoData<T = unknown> {
  isLoad: boolean;
  isAuthenticated: boolean;
  userInfo: T;
}

export const initialStateUserInfo: IUserInfoData = {
  isLoad: false,
  isAuthenticated: false,
  userInfo: null,
};

export const userInfoReducer = createReducer<IUserInfoData>(
  initialStateUserInfo,
  on(actionLoadUserInfo, (state, payload) => {
    return {
      ...state,
      isLoad: true,
      isAuthenticated: payload.isAuthenticated,
      userInfo: payload.userInfo,
    };
  }),
  on(actionClaerUserInfo, (state) => {
    return {
      ...state,
      ...initialStateUserInfo
    };
  })
);
