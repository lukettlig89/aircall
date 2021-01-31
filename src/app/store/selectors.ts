import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './state';

const getState = createFeatureSelector<AppState>('aircall');

const getUserState = createSelector(
  getState,
  (state) => state.user,
);

const getCallsState = createSelector(
  getState,
  (state) => state.calls,
);

const isLogged = createSelector(
  getUserState,
  (state) => state?.access_token !== undefined,
);

const loading = createSelector(
  getState,
  (state) => state.loading,
);

const getToken = createSelector(
  getUserState,
  (state) => state?.access_token,
);

const getUserInfo = createSelector(
  getUserState,
  (state) => state?.userInfo,
);

const getTotalCalls = createSelector(
  getCallsState,
  (state) => state?.totalCount,
);

const getCalls = createSelector(
  getCallsState,
  (state) => state?.nodes,
);

export const selectors = {
  isLogged,
  loading,
  getToken,
  getUserInfo,
  getTotalCalls,
  getCalls,
};
