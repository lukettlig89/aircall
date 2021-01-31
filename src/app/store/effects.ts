import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  AppAction,
  changeLoading,
  login,
  loginFailure,
  loginSuccess,
  refreshToken,
  retrieveCalls,
  retrieveCallsFailure,
  retrieveCallsSuccess
} from './actions';
import { AppState, UserInfo } from './state';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { RestRequestHelperService } from '../core/services/rest-request-helper.service';
import { basePath, Routes } from '../core/configs/routes';
import { CallsResponse, LoginParams, LoginResponse } from '../core/models/types';
import { of } from 'rxjs';
import { defaultItemPerPage } from '../core/configs/defaults';
import { selectors } from './selectors';

@Injectable()
export class Effects {

  callLogin$ = createEffect(() => this.actions$
    .pipe(
      ofType(login.type),
      map((action) => action.data),
      switchMap((params) =>
        this.restRequestHelperService.post<LoginParams, LoginResponse>(`${basePath}/${Routes.LOGIN}`, params)
          .pipe(map((response) => ({ params, response }))),
      ),
      map(({ params, response }) => loginSuccess({
        response: { ...response, userInfo: {...response.user, password: params.password } },
      })),
      catchError((err) => {
        console.warn(`Login call failed with error ${err.message}`);

        return of(loginFailure());
      })
    ));

  retrieveCalls$ = createEffect(() => this.actions$
    .pipe(
      ofType(retrieveCalls.type),
      switchMap((payload) =>
        this.restRequestHelperService.get<CallsResponse>(`${basePath}/${Routes.CALLS}?offset=${payload.offset}&limit=${payload.limit}`),
      ),
      map((response) => retrieveCallsSuccess({ response })),
      catchError((err) => {
        console.warn(`Get calls failed with error ${err.message}`);

        return of(retrieveCallsFailure());
      })
    ));

  retrieveInitialCalls$ = createEffect(() => this.actions$
    .pipe(
      ofType(loginSuccess.type),
      switchMap((_) =>
        this.restRequestHelperService.get<CallsResponse>(`${basePath}/${Routes.CALLS}?offset=0&limit=${defaultItemPerPage}`),
      ),
      map((response) => retrieveCallsSuccess({ response })),
      catchError((err) => {
        console.warn(`Get calls failed with error ${err.message}`);

        return of(retrieveCallsFailure());
      })
    ));

  showLoadingDistractor$ = createEffect(() => this.actions$
    .pipe(
      ofType(login.type),
      map(() => changeLoading({ loading: true })),
    ));

  hideLoadingDistractor$ = createEffect(() => this.actions$
    .pipe(
      ofType(
        loginSuccess.type,
        loginFailure.type,
      ),
      map(() => changeLoading({ loading: false })),
    ));

  refreshToken$ = createEffect(() => this.actions$
    .pipe(
      ofType(refreshToken.type),
      withLatestFrom(this.store.select(selectors.getUserInfo)),
      filter(([_, userInfo]) => userInfo !== undefined),
      map(([token, userInfo]) => loginSuccess({ response: { access_token: token, userInfo: userInfo as UserInfo }} )),
    ));

  constructor(
    private readonly restRequestHelperService: RestRequestHelperService,
    private readonly actions$: Actions<AppAction>,
    private readonly store: Store<AppState>,
  ) {}

}
