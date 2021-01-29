import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state';
import { login } from './actions';
import { selectors } from './selectors';
import { LoginParams } from '../core/models/types';

@Injectable({ providedIn: 'root'})
export class StoreFacade {

  isLogged$ = this.store.select(selectors.isLogged);
  loading$ = this.store.select(selectors.loading);

  constructor(
    public readonly store: Store<AppState>,
  ) { }

  login(data: LoginParams): void {
    this.store.dispatch(login({ data }));
  }

}
