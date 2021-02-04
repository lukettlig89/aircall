import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, filter, first, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AppState, UserInfo } from '../../store/state';
import { selectors } from '../../store/selectors';
import { LoginParams, LoginResponse } from '../models/types';
import { RestRequestHelperService } from '../services/rest-request-helper.service';
import { basePath, Routes } from '../configs/routes';
import { refreshToken } from '../../store/actions';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private store: Store<AppState>,
    private restRequestHelperService: RestRequestHelperService,
  ) {}

  /**
   * Intercepts all HTTP requests and adds the JWT token to the request's header if the URL
   * is a REST endpoint and not login.
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(Routes.LOGIN)) {
      return next.handle(request);
    }

    return this.addTokenFromState(request)
      .pipe(
        first(),
        mergeMap((requestWithToken: HttpRequest<any>) =>
          next.handle(requestWithToken)
            .pipe(
              catchError((err => {
                if (err.status === 401) {
                  return this.handleUnauthorizedError(request, next);
                }

                return throwError(err);
              }),
            ))
        ),
      );
  }

  private addTokenFromState(request: HttpRequest<any>): Observable<HttpRequest<any>> {
    return this.store.pipe(
      withLatestFrom(this.store.select(selectors.getToken)),
      mergeMap(([_, token]: [AppState, string | undefined]) => {
        if (token) {
          return of(this.addToken(request, token));
        }

        return of(request);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    request = request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${token}`),
    });

    return request;
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshToken()
        .pipe(
          switchMap((token) =>
            next.handle(this.addToken(request, token)),
          ),
        );
  }

  private refreshToken(): Observable<string> {
    return this.store
      .pipe(
        first(),
        withLatestFrom(this.store.select(selectors.getUserInfo)),
        map(([_, userInfo]) => ({ username: userInfo?.username, password: userInfo?.password} as UserInfo)),
        filter((userInfo) => userInfo?.username !== undefined && userInfo?.password !== undefined),
        switchMap((userInfo) =>
          this.restRequestHelperService.post<LoginParams, LoginResponse>(
            `${basePath}/${Routes.LOGIN}`,
            { username: userInfo?.username, password: userInfo?.password })
        ),
        tap((response) => {
          this.store.dispatch(refreshToken({ token: response.access_token }));
        }),
        map((response: LoginResponse) => response.access_token),
    );
  }
}
