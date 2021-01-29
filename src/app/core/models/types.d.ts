// REQUEST
export interface LoginParams {
  username: string;
  password: string;
}

// RESPONSE
export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
}
