import { createReducer, on } from '@ngrx/store';
import { initialState, UserState } from './state';
import { changeLoading, loginSuccess, retrieveCallsSuccess } from './actions';
import { CallsResponse } from '../core/models/types';

const userReducer = createReducer<UserState | undefined>(
  initialState.user,
  on(
    loginSuccess,
    (_, { response }): UserState | undefined => response,
  ),
);

const loadingReducer = createReducer<boolean>(
  initialState.loading,
  on(
    changeLoading,
    (_, { loading }): boolean => loading,
  ),
);

const callsReducer = createReducer<CallsResponse | undefined>(
  initialState.calls,
  on(
    retrieveCallsSuccess,
    (_, { response }): CallsResponse | undefined => response,
  ),
);

export const reducers = {
    user: userReducer,
    loading: loadingReducer,
    calls: callsReducer,
};
