import { CallsResponse, User } from '../core/models/types';

export const initialState: AppState = Object.freeze({
  loading: false,
});

export interface AppState {
  user?: UserState;
  loading: boolean;
  calls?: CallsState;
}

export interface UserState {
  access_token: string;
  userInfo: UserInfo;
}

export interface UserInfo extends User {
  password: string;
}

export type CallsState = CallsResponse;
