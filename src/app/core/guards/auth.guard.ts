import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AppState } from '../../store/state';
import { Store } from '@ngrx/store';
import { selectors } from '../../store/selectors';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RestRequestHelperService } from '../services/rest-request-helper.service';
import { basePath, Routes } from '../configs/routes';
import { Injectable } from '@angular/core';
import { LoginParams, LoginResponse } from '../models';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly store: Store<AppState>,
    private readonly restRequestHelper: RestRequestHelperService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return from(this.store.select(selectors.getUserInfo))
      .pipe(
        switchMap((userInfo) => {
          if (userInfo?.password === undefined || userInfo.username === undefined) {
            return of({ access_token: undefined });
          }

          return this.restRequestHelper.post<LoginParams, LoginResponse>(
            `${basePath}/${Routes.LOGIN}`,
            { username: userInfo?.username, password: userInfo?.password });
        }),
        map((res) => res.access_token !== undefined),
      );
  }
}
