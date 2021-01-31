import { CallsResponse, LoginResponse, User } from '../core/models/types';

export const initialState: AppState = Object.freeze({
  loading: false,
});

export interface AppState {
  user?: UserState;
  loading: boolean;
  calls?: CallsResponse;
}

export interface UserState {
  access_token: string;
  userInfo: UserInfo;
}

export interface UserInfo extends User {
  password: string;
}
