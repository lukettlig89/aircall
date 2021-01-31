import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state';
import { login, retrieveCalls } from './actions';
import { selectors } from './selectors';
import { Call, LoginParams } from '../core/models/types';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class StoreFacade {

  isLogged$ = this.store.select(selectors.isLogged);
  loading$ = this.store.select(selectors.loading);
  calls$ = this.store.select(selectors.getCalls)
    .pipe(
      // @ts-ignore
      filter((calls) => calls !== undefined),
      map((calls: Call[]) => calls.slice().sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime())),
    );
  totalCalls$ = this.store.select(selectors.getTotalCalls);

  constructor(
    public readonly store: Store<AppState>,
  ) { }

  login(data: LoginParams): void {
    this.store.dispatch(login({ data }));
  }

  retrieveCalls(offset: number, limit: number): void {
    this.store.dispatch(retrieveCalls({ offset, limit }));
  }

}
