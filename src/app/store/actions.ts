import { createAction, props, union } from '@ngrx/store';
import { ArchiveCallResponse, CallsResponse, LoginParams } from '../core/models/types';
import { UserState } from './state';

export const changeLoading = createAction(
  '[Change loading state]',
  props<{ loading: boolean }>(),
);

export const login = createAction(
  '[Log in]',
  props<{ data: LoginParams }>(),
);

export const loginSuccess = createAction(
  '[Log in success]',
  props<{ response?: UserState }>(),
);

export const loginFailure = createAction(
  '[Log in failure]'
);

export const retrieveCalls = createAction(
  '[Retrieve calls]',
  props<{ offset: number; limit: number }>(),
);

export const retrieveCallsSuccess = createAction(
  '[Retrieve calls success]',
  props<{ response?: CallsResponse }>(),
);

export const retrieveCallsFailure = createAction(
  '[Retrieve calls failure]'
);

export const archiveCall = createAction(
  '[Change archive status]',
  props<{ callId: string }>(),
);

export const archiveCallSuccess = createAction(
  '[Archieve call success]',
  props<{ response?: ArchiveCallResponse }>(),
);

export const archiveCallFailure = createAction(
  '[Archieve call failure]'
);

export const refreshToken = createAction(
  '[Refresh token]',
  props<{ token: string }>(),
);

const actions = union({
  login,
  loginSuccess,
  loginFailure,
  retrieveCalls,
  retrieveCallsSuccess,
  retrieveCallsFailure,
  archiveCall,
  archiveCallSuccess,
  archiveCallFailure,
});

export type AppAction = typeof actions;
