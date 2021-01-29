import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppAction, changeLoading, login, loginFailure, loginSuccess } from './actions';
import { AppState } from './state';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RestRequestHelperService } from '../core/services/rest-request-helper.service';
import { Routes } from '../core/configs/routes';
import { LoginParams, LoginResponse } from '../core/models/types';

@Injectable()
export class Effects {

  callLogin$ = createEffect(() => this.actions$
    .pipe(
      ofType(login.type),
      map((action) => action.data),
      switchMap((params) => this.restRequestHelperService.post<LoginParams, LoginResponse>(Routes.LOGIN, params)),
      tap(console.warn),
      map((response) => loginSuccess({ response })),
      catchError((err) => {
        console.warn(`Login call failed with error ${err}`);

        return loginFailure;
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

  constructor(
    private readonly restRequestHelperService: RestRequestHelperService,
    private readonly actions$: Actions<AppAction>,
    private readonly store: Store<AppState>,
  ) {}

}
