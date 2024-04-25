import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../../helpers/api.helper';
import { Store } from '@ngrx/store';
import { ILineChanelData } from '../../stores/line-chanel/line-chanel.reducer';
import { map, Observable } from 'rxjs';
import { IApiResponse, ILineProviderEnv } from '../../core/interfaces';
import { UtilsService } from '../utils/utils.service';
import liff, { Liff } from '@line/liff';

export interface ILineProvider {
  clientId: string;
  clientSecret: string;
  icon: string;
  liffId: string;
  name: string;
  state: string;
  pathCallback: string;
}
export interface IObjectLineProvide {
  status: boolean;
  authType: string;
  lineState: string;
  code: string;
  lineProvide: ILineProvider;
}

export interface ILoginLineParams {
  loginData: string;
  accPicture: string;
  accFirstname: string;
  lineClientId: string;
  optionsLine: object;
}

export interface IArgumentLineToken {
  code: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
}

export interface IResponseLineToken {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface IResponseLineVerify {
  amr: string[];
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  picture: string;
  sub: string;
}

@Injectable({
  providedIn: 'root',
})
export class LineService {
  urlLineApi = {
    authen: 'https://access.line.me/oauth2/v2.1/authorize',
    token: 'https://api.line.me/oauth2/v2.1/token',
    verify: 'https://api.line.me/oauth2/v2.1/verify',
  };

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    private store: Store<{ lineChanel: ILineChanelData }>
  ) {}

  connectLineLiff(liffId: string) {
    return new Observable<string>((observer) => {
      liff.init({ liffId: liffId }).then(() => {
        if (liff.isLoggedIn() === false) {
          liff.login();
        }
        if (liff.getIDToken() == null) {
          observer.error(false);
        } else {
          observer.next(`${liff.getIDToken()}`);
        }
        observer.complete();
      });
    });
  }

  getLineChanels() {
    return this.store.select('lineChanel').pipe(
      map((line) => {
        const data: ILineProviderEnv[] = [];
        const lineObject = line.data as { lineChanel: any[] };
        if (lineObject?.lineChanel && lineObject?.lineChanel.length > 0) {
          lineObject.lineChanel.forEach((e) => {
            data.push({
              liffId: e?.chanelLiffId,
              state: e?.lineClientId,
              icon: e?.chanelIcon || './assets/logo/logo-line.svg',
              name: e?.chanelLabel,
              clientId: e?.lineClientId,
              clientSecret: e?.chanelClientSecret,
              pathCallback: e?.chanelCallBack,
            });
          });
        }
        return data;
      })
    );
  }

  fetchLineChanelAll() {
    return this.http.get<IApiResponse<{ lineChanel: any[] }>>(
      ApiHelper.api('line-chanel')
    ).pipe(map((res) => this.utilsService.handleResponse(res)));
  }

  //-- refresh code line
  fetchLineToken(arg: IArgumentLineToken) {
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'authorization_code');
    requestBody.append('code', arg.code);
    requestBody.append('redirect_uri', arg.redirect_uri);
    requestBody.append('client_id', arg.client_id);
    requestBody.append('client_secret', arg.client_secret);

    return this.http.post<IResponseLineToken>(
      ApiHelper.api(this.urlLineApi.token),
      requestBody,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }

  //-- verify token line
  fetchLineVerify(arg: { id_token: string; client_id: string }) {
    const requestBody = new URLSearchParams();
    requestBody.append('id_token', arg.id_token);
    requestBody.append('client_id', arg.client_id);

    return this.http.post<IResponseLineVerify>(
      ApiHelper.api(this.urlLineApi.verify),
      requestBody,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }

  //-- login LINE by API
  authenLine(body: ILoginLineParams) {
    return this.http
      .post<IApiResponse<{ code: number; token: string }>>(
        ApiHelper.api('authen/line'),
        {
          action: 'AUTHEN_LINE',
          ...body,
        }
      )
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }

  //-- link line authen
  getUrlAuthenLine(line: ILineProviderEnv, action: 'LINE' | 'LIFF' | 'CONNECT' = 'LINE') {
    const urlCallBack = decodeURIComponent(line.pathCallback);
    let url = new URL(this.urlLineApi.authen);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', line.clientId);
    url.searchParams.set('redirect_uri', urlCallBack);
    url.searchParams.set('state', `${line.state}@${action}`);
    url.searchParams.set('scope', ['profile', 'openid'].join(' '));
    url.searchParams.set('disable_auto_login', 'false');

    return url.toString();
  }
}
