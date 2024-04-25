import { Injectable } from '@angular/core';
import { IApiResponse } from '../../core/interfaces';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private notification: NzNotificationService,
  ) { }

  handleResponse<T = unknown>(respone: IApiResponse<T>) {
    console.log('UtilsService -> ', respone);
    if(respone.meta.response_code == '20000') {
      return respone?.data ?? null
    } else{ 
      if(typeof respone.meta.response_desc == 'string') {
        this.notification.error('Alert', respone.meta.response_desc)
        return null;
      }
      this.notification.error('Warning', 'message in object');
      console.error(respone.meta.response_desc);
      return respone.meta.response_desc;
    }
  }
}
