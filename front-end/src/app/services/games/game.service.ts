import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { ApiHelper } from '../../helpers/api.helper';
import { IApiResponse } from '../../core/interfaces';
import { map } from 'rxjs';
import {
  ICategoryGame,
  IGameData,
  IRootBoardGame,
  IRootPlayGame,
} from '../../stores/game/game.reducer';
import { Store } from '@ngrx/store';
import {
  actionLoadBoardGame,
  actionLoadCateGame,
  actionLoadGame,
  actionLoadHistoryGame,
  actionLoadPlayGame,
} from '../../stores/game/game.action';

export interface IBodySaveHistory {
  gmBoardId: number,
  gmGameFormatKey: string,
  gmGameLevel: number,
  gmScore: number,
  gmScoreTotal: number,
  gmTime: number,
  gmHisSystem: any,
  gmHisRecord: any,
  gmHisGameRule: any,
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    private store: Store<{ game: IGameData }>
  ) {}

  getGameAll() {
    return this.store.select('game');
  }

  saveHistoryGame(token: string, body: IBodySaveHistory) {
    return this.http
      .post<IApiResponse<ICategoryGame[]>>(ApiHelper.api('game/save-answer'), body, {
        headers: ApiHelper.header({ token }),
      })
      .pipe(
        map((res) => this.utilsService.handleResponse(res))
      );
  }

  fetchGameCateToStrore(token: string) {
    return this.http
      .get<IApiResponse<ICategoryGame[]>>(ApiHelper.api('game/categories/'), {
        headers: ApiHelper.header({ token }),
      })
      .pipe(
        map((res) => this.utilsService.handleResponse(res)),
        map((data) => {
          if (data) {
            this.store.dispatch(actionLoadCateGame({ category: data }));
            return data;
          }
          return null;
        })
      );
  }

  fetchGameBoard(token: string, ids: string) {
    let params = new HttpParams();
    if(ids) {
      params = params.append('ids', ids);
    }

    return this.http
      .get<IApiResponse<IRootBoardGame[]>>(
        ApiHelper.api(`game/board-by-cate`),
        {
          headers: ApiHelper.header({ token }),
          params: params,
        }
      )
      .pipe(
        map((res) => this.utilsService.handleResponse(res)),
        map((data) => {
          if (data) {
            this.store.dispatch(actionLoadBoardGame({ game: data }));
            return data;
          }
          return null;
        })
      );
  }

  fetchGameBoardById(token: string, id: number) {
    return this.http
      .get<IApiResponse<IRootPlayGame>>(ApiHelper.api(`game/board/${id}`), {
        headers: ApiHelper.header({ token }),
      })
      .pipe(
        map((res) => this.utilsService.handleResponse(res)),
        map((data) => {
          if (data) {
            this.store.dispatch(actionLoadPlayGame({ play: data }));
            return data;
          }
          return null;
        })
      );
  }

  fetchGameHistory(token: string) {
    return this.http
      .get<IApiResponse<any[]>>(ApiHelper.api(`game/history-count`), {
        headers: ApiHelper.header({ token }),
      })
      .pipe(
        map((res) => this.utilsService.handleResponse(res)),
        map((data) => {
          if (data) {
            this.store.dispatch(actionLoadHistoryGame({ histroy: data }));
            return data;
          }
          return [];
        })
      );
  }
}
