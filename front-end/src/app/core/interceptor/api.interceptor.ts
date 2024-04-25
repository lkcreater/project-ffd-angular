import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../../helpers/api.helper';
import { catchError, EMPTY, map, of, tap } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private notification: NzNotificationService
  ) {}

  mapCacheRoute = new Map();

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //-- route LINE
    if (req.url.startsWith('https://api.line.me')) {
      return next.handle(req);
    }

    const clone = req.clone({
      url: ApiHelper.host(`/api/v1/${req.url}`),
    });

    return next.handle(clone).pipe(
      catchError((err) => {
        this.notification.error('Server Error: ' + err.name, err.message);
        return EMPTY;
      })
    );

    // //-- no cache
    // if(!this.hasMapCacheRoute(clone)) {
    //   console.log('url ==> ', req.url);
    //   return next.handle(clone);
    // }

    // //-- for cache
    // const cacheData = this.mapCacheRoute.get(clone.urlWithParams);
    // if(cacheData) {
    //   return of(cacheData);
    // }
    // console.log('url cache ==> ', req.url, cacheData);

    // return next.handle(clone).pipe(tap(res => {
    //   this.mapCacheRoute.set(clone.urlWithParams, res)
    // }));
  }

  hasMapCacheRoute(req: HttpRequest<any>): boolean {
    return (
      req.urlWithParams.includes('line-chanel') ||
      req.urlWithParams.includes('term')
    );
  }
}
