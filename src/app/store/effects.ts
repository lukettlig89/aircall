import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  AppAction,
  archiveCall,
  archiveCallSuccess,
  changeLoading,
  login,
  loginFailure,
  loginSuccess,
  refreshToken,
  retrieveCalls,
  retrieveCallsSuccess
} from './actions';
import { AppState, UserInfo } from './state';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { RestRequestHelperService } from '../core/services/rest-request-helper.service';
import { basePath, Routes } from '../core/configs/routes';
import { ArchiveCallResponse, CallsResponse, LoginParams, LoginResponse } from '../core/models/types';
import { defaultItemPerPage } from '../core/configs/defaults';
import { selectors } from './selectors';
import { Router } from '@angular/router';
import { ErrorService } from '../core/services/error.service';
import { of } from 'rxjs';

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
        response: { access_token: response.access_token, userInfo: {...response.user, password: params.password } },
      })),
      catchError((err) => {
        this.errorService.notifyError(err);

        return of(loginFailure());
      }),
    ));

  retrieveCalls$ = createEffect(() => this.actions$
    .pipe(
      ofType(retrieveCalls.type),
      switchMap((payload) =>
        this.restRequestHelperService.get<CallsResponse>(`${basePath}/${Routes.CALLS}?offset=${payload.offset}&limit=${payload.limit}`),
      ),
      map((response) => retrieveCallsSuccess({ response })),
      catchError((err) => {
        this.errorService.notifyError(err);

        throw err;
      }),
    ));

  retrieveInitialCalls$ = createEffect(() => this.actions$
    .pipe(
      ofType(loginSuccess.type),
      switchMap((_) =>
        this.restRequestHelperService.get<CallsResponse>(`${basePath}/${Routes.CALLS}?offset=0&limit=${defaultItemPerPage}`),
      ),
      tap(() => {
        this.router.navigateByUrl('/calls');
      }),
      map((response) => retrieveCallsSuccess({ response })),
      catchError((err) => {
        this.errorService.notifyError(err);

        throw err;
      }),
    ));

  archiveCall$ = createEffect(() => this.actions$
    .pipe(
      ofType(archiveCall.type),
      switchMap(({ callId }) =>
        this.restRequestHelperService.put<ArchiveCallResponse>(`${basePath}/${Routes.CALLS}/${callId}/${Routes.ARCHIVE_CALL}`),
      ),
      map((response) => archiveCallSuccess()),
      catchError((err) => {
        this.errorService.notifyError(err);

        throw err;
      }),
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
    private readonly errorService: ErrorService,
    private readonly router: Router,
  ) {}

}
