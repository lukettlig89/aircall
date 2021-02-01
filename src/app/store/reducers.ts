import { createReducer, on } from '@ngrx/store';
import { initialState, UserState } from './state';
import { archiveCallSuccess, changeLoading, loginSuccess, retrieveCallsSuccess } from './actions';
import { CallsState } from './state';
import { Call } from '../core/models';

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

const callsReducer = createReducer<CallsState | undefined>(
  initialState.calls,
  on(
    retrieveCallsSuccess,
    (_, { response }): CallsState | undefined => response,
  ),
  on(
    archiveCallSuccess,
    (state, { response }): CallsState | undefined => {
      const callsWithoutCallChanged = state?.nodes.filter((call) => call.id !== response?.id) ?? [];

      return {...state as CallsState, nodes: [...callsWithoutCallChanged, response as Call]};
    },
  ),
);

export const reducers = {
    user: userReducer,
    loading: loadingReducer,
    calls: callsReducer,
};
