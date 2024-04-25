import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../../helpers/api.helper';
import { IApiResponse, IFileObject } from '../../core/interfaces';
import { map, Observable } from 'rxjs';
import { UtilsService } from '../utils/utils.service';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    private store: Store<{ config: any }>
  ) {}

  getUrl(url: IFileObject) {
    let link;
    if(!url) {
      return null;
    }
    if(url?.object == 'LINE') {
      return url?.fileUrl;
    }
    this.store.select('config').subscribe(res => {
      link = res.data?.obs_url + '/' + url?.fileUrl;
    });
    return link
  }

  getConfiguration() {
    return this.http
      .get<
        IApiResponse<{
          obs_url: string;
        }>
      >(ApiHelper.api('config'))
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }

  uploadFormData(token: string, upload: FormData) {
    return this.http
      .post<
        IApiResponse<{
          url: string;
          file: any;
        }>
      >(ApiHelper.api('upload'), upload, {
        headers: ApiHelper.header({ token }, true),
      })
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }

  getImageBase64(file: File) {
    return new Observable<string>((observable) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        observable.next(reader.result?.toString());
        observable.complete();
      };
      reader.onerror = (error) => {
        observable.error(error);
        observable.complete();
      };
    });
  }

  uploadBase64(token: string, upload: string) {
    return this.http
      .post<
        IApiResponse<{
          url: string;
          file: any;
        }>
      >(
        ApiHelper.api('upload/base64'),
        JSON.stringify({ file: upload }),
        {
          headers: ApiHelper.header({ token }),
        }
      )
      .pipe(map((res) => this.utilsService.handleResponse(res)));
  }
}
