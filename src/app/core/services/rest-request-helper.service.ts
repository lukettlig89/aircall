import { Injectable } from '@angular/core';
import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Observable } from 'rxjs';
import { basePath } from '../configs/routes';

export const enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

@Injectable({ providedIn: 'root' })
export class RestRequestHelperService {

  constructor(
    private readonly httpClient: HttpClient,
  ) {}


  post<T, V>(path: string, body: T, options?: HttpParamsOptions): Observable<V> {
    return this.httpClient.request<V>(HttpMethod.POST, `${basePath}/${path}`, {...options, body});
  }

}
