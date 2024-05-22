import { createAction, props } from '@ngrx/store';
import { ICategoryGame, IHistoryGamePlaying, IRootBoardGame, IRootPlayGame } from './game.reducer';

export enum EGameAction {
  LOAD = '[game] load data',
  LOAD_CATE = '[cate game] load data',
  LOAD_BOARD_GAME = '[board game] load data',
  LOAD_PLAY_GAME = '[play game] load data',
  LOAD_HIS_PLAYING = '[history game] load data',
}

export const actionLoadGame = createAction(EGameAction.LOAD, props<any>());

export const actionLoadCateGame = createAction(
  EGameAction.LOAD_CATE,
  props<{ category: ICategoryGame[] }>()
);

export const actionLoadBoardGame = createAction(
  EGameAction.LOAD_BOARD_GAME,
  props<{ game: IRootBoardGame[] }>()
);

export const actionLoadPlayGame = createAction(
  EGameAction.LOAD_BOARD_GAME,
  props<{ play: IRootPlayGame }>()
);

export const actionLoadHistoryGame = createAction(
  EGameAction.LOAD_HIS_PLAYING,
  props<{ histroy: IHistoryGamePlaying[] }>()
);
