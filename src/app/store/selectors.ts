import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './state';

const getState = createFeatureSelector<AppState>('aircall');

const isLogged = createSelector(
  getState,
  (state) => state.user?.access_token !== undefined,
);

const loading = createSelector(
  getState,
  (state) => state.loading,
);

export const selectors = {
  isLogged,
  loading,
};
