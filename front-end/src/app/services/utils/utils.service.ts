import { Injectable } from '@angular/core';
import { IApiResponse } from '../../core/interfaces';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private notification: NzNotificationService, private router: Router,) {}

  handleResponse<T = unknown>(respone: IApiResponse<T>) {
    // console.log('UtilsService -> ', respone);
    if (respone.meta.response_code == '20000') {
      return respone?.data ?? null;
    } else if (respone.meta.response_code == '40300') {
      this.router.navigate(['/auth/log-out']);
      return null;
    } else {
      // if (typeof respone.meta.response_desc == 'string') {
      //   this.notification.error('แจ้งเตือน', respone.meta.response_desc);
      //   return null;
      // }
      // this.notification.error('Warning', 'message in object');
      // return respone.meta.response_desc;
      return null
    }
  }
}
