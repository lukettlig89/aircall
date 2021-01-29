import { createReducer, on } from '@ngrx/store';
import { initialState, UserState } from './state';
import { loginSuccess, changeLoading } from './actions';

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

export const reducers = {
    user: userReducer,
    loading: loadingReducer,
};
