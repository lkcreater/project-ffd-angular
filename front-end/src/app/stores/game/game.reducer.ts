import { createReducer, on } from '@ngrx/store';
import {
  actionLoadBoardGame,
  actionLoadCateGame,
  actionLoadGame,
  actionLoadHistoryGame,
  actionLoadPlayGame,
} from './game.action';
import { IFileObject } from '../../core/interfaces';
import { EFormatGameKey } from '../../helpers/game.helper';

export interface ICategoryGame {
  active: boolean;
  createdBy: string;
  createdDatetime: string;
  gmCateDetail: any | null;
  gmCateId: number;
  gmCateImage: {
    size: number;
    type: string;
    object: string;
    fileUrl: string;
    newName: string;
  } | null;
  gmCateOption: any | null;
  gmCateSlug: string | null;
  gmCateTitle: string;
  order: number;
  updatedBy: string;
  updatedDatetime: string;
}
//Board Game
export interface IRootBoardGame {
  gmBoardId: number;
  gmCateId: number;
  order: number;
  gmFormId: number;
  gmBoardSlug: string;
  gmBoardImage: IFileObject;
  gmBoardTitle: string;
  gmBoardDetail: string;
  gmBoardOption: any;
  active: boolean;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
  format: IFormatBoardGame;
  categories: Categories;
}

export interface IFormatBoardGame {
  gmFormId: number;
  order: number;
  gmFormImage: IFileObject;
  gmFormName: string;
  gmFormDetail: any;
  gmRuleGame: GmRuleGame;
  gmRulePoint: any;
  gmRuleReward: any;
  active: boolean;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface Categories {
  gmCateId: number;
  order: number;
  gmCateSlug: any;
  gmCateImage: IFileObject;
  gmCateTitle: string;
  gmCateDetail: any;
  gmCateOption: any;
  active: boolean;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
}

// playing
export interface IRootPlayGame extends IRootBoardGame {
  question: IQuestion[];
}

export interface IQuestion {
  gmQuestId: number;
  gmBoardId: number;
  order: number;
  gmQuestLevel: number;
  gmQuestSlug: any;
  gmQuestImage: any;
  gmQuestTitle: string;
  gmQuestDetail: any;
  gmQuestOption: IQuestionOptions;
  active: boolean;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
  answers: IAnswer[];
}

export interface IAnswer {
  gmAnsId: number;
  gmQuestId: number;
  gmAnsChoice: any;
  active: boolean;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface IGmAnsChoice {
  image: IFileObject;
  choice: string;
  detail: string;
  result: boolean;
}

export interface GmRuleGame {
  format: EFormatGameKey; //-- รูปแบบเกมส์
  score: number;  //-- คะแนนเต็ม ในแต่ล่ะข้อ
  timeScope: number; //-- ช่วงเวลาที่ไม่เอาคะแนนไปคำนวณ (วินาที)
  timeMax: number; //-- เวลาเต็มต่อข้อ (วินาที)
  randomQuestion: boolean; //-- ซุ่มคำถาม
  randomChoice: boolean; //-- ซุ่มคำตอบ
  limitQuestion: number; //-- จำนวนคำถามที่แสดง
  limitHistoryCaleScore: number; //-- นับคะแนนจากประวัติการเล่นได้กี่ครั้ง ตัวอย่างนับจาก 3 ครั้งแรกที่เล่นเท่านั้น
}

export interface IQuestionOptions {
  score: number;  //-- คะแนนเต็ม ในแต่ล่ะข้อ
  timeScope: number; //-- ช่วงเวลาที่ไม่เอาคะแนนไปคำนวณ (วินาที)
  timeMax: number; //-- เวลาเต็มต่อข้อ (วินาที)
}

export interface IHistoryGamePlaying {
  board_id: number;
  counter: number;
}

export interface IGameData {
  isLoad: boolean;
  data: any;
  category: ICategoryGame[] | null;
  game: IRootBoardGame[] | null;
  play: IRootPlayGame | null;
  histroy: IHistoryGamePlaying[]
}

export const initialStateData: IGameData = {
  isLoad: false,
  data: null,
  category: null,
  game: null,
  play: null,
  histroy: []
};

export const gameReducer = createReducer<IGameData>(
  initialStateData,
  on(actionLoadGame, (state, payload) => {
    return {
      ...state,
      isLoad: true,
      data: payload,
    };
  }),
  on(actionLoadCateGame, (state, { category }) => {
    return {
      ...state,
      isLoad: true,
      category: category,
    };
  }),
  on(actionLoadBoardGame, (state, { game }) => {
    return {
      ...state,
      isLoad: true,
      game: game,
    };
  }),
  on(actionLoadPlayGame, (state, { play }) => {
    return {
      ...state,
      isLoad: true,
      play: play,
    };
  }),
  on(actionLoadHistoryGame, (state, { histroy }) => {
    return {
      ...state,
      histroy: histroy
    };
  })
);
