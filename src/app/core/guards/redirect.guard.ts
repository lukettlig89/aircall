import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AppState } from '../../store/state';
import { Store } from '@ngrx/store';
import { selectors } from '../../store/selectors';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class RedirectGuard implements CanActivate {

  constructor(
    private readonly store: Store<AppState>,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return combineLatest([
      this.store.select(selectors.getUserInfo),
      this.store.select(selectors.getToken),
    ])
    .pipe(
      map(([userInfo, token]) =>
        userInfo?.username === undefined && userInfo?.password === undefined && token === undefined),
    );
  }
}
