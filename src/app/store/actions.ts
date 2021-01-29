import { createAction, props, union } from '@ngrx/store';
import { LoginParams, LoginResponse } from '../core/models/types';

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
  props<{ response?: LoginResponse }>(),
);

export const loginFailure = createAction(
  '[Log in failure]'
);

const actions = union({
  login,
  loginSuccess,
  loginFailure,
});

export type AppAction = typeof actions;
