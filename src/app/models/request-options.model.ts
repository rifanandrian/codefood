import { HttpHeaders, HttpParams } from '@angular/common/http';

export class RequestOptions {
  headers?: HttpHeaders;
  observe?: any;
  params?: HttpParams;
  reportProgress?: boolean;
  withCredentials?: boolean;
  responseType: any;
  merge(options: RequestOptions) {
    Object.assign(this, options);
  }
}