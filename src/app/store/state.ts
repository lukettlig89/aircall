import { LoginResponse } from '../core/models/types';

export const initialState: AppState = Object.freeze({
  loading: false,
});

export interface AppState {
  user?: UserState;
  loading: boolean;
}

export type UserState = LoginResponse;
