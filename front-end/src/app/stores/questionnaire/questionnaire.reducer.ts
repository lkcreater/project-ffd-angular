import { createReducer, on } from '@ngrx/store';
import { actionLoadQuestionnaire } from './questionnaire.action';

export interface IRootQuestion {
  hcqId: number
  order: number
  hcqType: string
  hcGroupUuid: string
  hcqLevel: number
  hcqDate: string
  hcqSubject: string
  hcqDetail: string
  hcqImage: IHcqImage
  hcqOptions: IHcqOptions
  active: boolean
  createdBy: string
  updatedBy: string
  createdDatetime: string
  updatedDatetime: string
  answers: IQuestionAnswer[]
}

export interface IHcqImage {
  size: number
  type: string
  object: string
  fileUrl: string
  newName: string
  originalName: string
}

export interface IHcqOptions {
  rule: 'oneChoice' | 'multiChoice'
}

export interface IQuestionAnswer {
  ansId: number
  hcqId: number
  order: number
  ansDate: string
  ansSubject: string
  ansScore: number
  active: boolean
  createdBy: string
  updatedBy: string
  createdDatetime: string
  updatedDatetime: string
}
export interface IRuleResultQuestionnaire{
  hcrId: number
  hcqType: string
  hcGroupUuid: string
  hcrResult: string
  hcrMin: number
  hcrMax: number
  active: boolean
  createdBy: string
  updatedBy: string
  createdDatetime: string
  updatedDatetime: string
}
export interface IResultQuestionnaire {
  TYPE_RULE: Record<string, string>;
  CONFIG: { order: number; key: string; type: 'fixed' | 'commit' }[];
  rule: IRuleResultQuestionnaire[];
  questions: Record<string, IRootQuestion[]>;
}
export interface IQuestionnaireData {
  isLoad: boolean;
  data: IResultQuestionnaire | null;
}

export const initialStateData: IQuestionnaireData = {
  isLoad: false,
  data: null,
};

export const questionnaireReducer = createReducer<IQuestionnaireData>(
  initialStateData,
  on(actionLoadQuestionnaire, (state, payload) => {
    return {
      ...state,
      isLoad: true,
      data: payload,
    };
  })
);
