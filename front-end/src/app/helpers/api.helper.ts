import { HttpHeaders } from '@angular/common/http';
import { EnvHelper } from './env.helper';

interface BaseIObjectHeader { 
  [key: string]: string 
}
export interface IObjectHeader extends BaseIObjectHeader {
  token: string;
}

export class ApiHelper {
  public static host(path: string = '') {
    const host = EnvHelper.key('hostApi');
    return `${host}${path}`;
  }

  public static api(path: string) {
    return path
    // console.log(`API ====> ${path}`);
    // if(path.startsWith('https://api.line.me')) {
    //   return path;
    // }
    // return ApiHelper.host(`/api/v1/${path}`);
  }

  public static header(object: BaseIObjectHeader, isByPass: boolean = false) {
    let header = {} 
    if(isByPass == false) {
      Object.assign(header, {
        'Content-Type': 'application/json',
      });
    }
    if(object['token']) {
      Object.assign(header, {
        'Authorization': 'Bearer ' + object['token']
      })
      delete object['token'];
    }

    Object.assign(header, object)
    return new HttpHeaders(header);
  }

  public static hostTisco(path: string = '') {
    const host = EnvHelper.key('tisco_api');
    return `${host}${path}`;
  }
}
