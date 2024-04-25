import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../../helpers/api.helper';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  getConnect() {
    // const url = ApiHelper.host('/');
    // console.log('test host docker -> ',url);
    return this.http.get('line-chanel');
  }

  getConnectTest() {
    // const url = 'http://159.138.242.188:3000/test-api';
    // console.log('test host docker -> ',url);
    // return this.http.get(url);
  }
}
