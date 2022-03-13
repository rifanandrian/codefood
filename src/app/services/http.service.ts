import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RequestOptions } from '../models/request-options.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient,) {
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse): Observable<HttpErrorResponse> {
    return throwError(errorResponse);
  }

  private prepareRequest(query?: HttpParams, options?: RequestOptions): RequestOptions {
    const requestOptions: RequestOptions = new RequestOptions();
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Content-Type': 'application/json'
    });

    if (options) {
      requestOptions.merge(options);
    }
    if (query) {
      requestOptions.params = query;
    }
    requestOptions.headers = headers;
    return requestOptions;
  }

  get(serviceUrl: string, query?: any, options?: any): Observable<any> {
    const requestOptions = options;

    let url = `${this.BASE_URL}/${serviceUrl}`;
    return this.http.get<any>(url, requestOptions)
      .pipe(
        map(response => response),
        catchError(this.handleErrorResponse),
      );
  }

  post(serviceUrl: string, payload: any, options?: any): Observable<any> {
    const requestOptions = options;
    let url = `${this.BASE_URL}/${serviceUrl}`;
    return this.http.post<any>(url, payload, requestOptions)
      .pipe(
        map(response => response),
        catchError(this.handleErrorResponse),
      );
  }

  put(serviceUrl: string, payload: any, options?: any): Observable<any> {
    const requestOptions = options;
    let url = `${this.BASE_URL}/${serviceUrl}`;
    return this.http.put<any>(url, payload, requestOptions)
      .pipe(
        map(response => response),
        catchError(this.handleErrorResponse),
      );
  }

}
