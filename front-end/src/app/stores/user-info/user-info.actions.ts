import { createAction, props } from '@ngrx/store';
import { IUserInfoData } from './user-info.reducer';
import { IFileObject } from '../../core/interfaces';

export interface IPeronaIcon {
  iconId: number
  iconLevel: number
  iconName: string
  iconImage: IFileObject
  iconDetail: string
  iconMinScore: number
  iconMaxScore: number
  active: boolean
  createdBy: string
  updatedBy: string
  createdDatetime: string
  updatedDatetime: string
}

export interface IInfoProfile {
  hasPassword: boolean;
  compCode?: any;
  dateVarConsent?: any;
  dateVarTermCondition: string;
  accPicture?: any;
  accFirstname: string;
  accLastname?: any;
  accBirthdate?: any;
  cmsProSex: string;
  occId: string;
  accOccupation?: any;
  eduId: string;
  accEducation?: any;
  accAddress?: any;
  active: boolean;
  createdDatetime: string;
  updatedDatetime: string;
  chanelLogin: ILoginChanel[];
  peronaIcon: IPeronaIcon;
}
export interface ILoginChanel {
  id: number;
  lineClientId?: any;
  acceptConsent?: any;
  dateVerConsent?: any;
  loginVerify: number; //-- 0 ค่าเริ่มต้น 1 verify member 2 unverify member
  loginPlatform: string;
  loginData: string;
  isDefault: boolean;
  isLineLiff: boolean;
  status: string;
  active: boolean;
  lastLogin: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export enum EUserInfoAction {
  LOAD = '[user info] load data user info',
  CLEAR = '[user info] clear data user info',
}

export const actionLoadUserInfo = createAction(
  EUserInfoAction.LOAD,
  props<IUserInfoData<IInfoProfile | null>>()
);

export const actionClaerUserInfo = createAction(EUserInfoAction.CLEAR);
