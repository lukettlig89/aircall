
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

export interface CallsResponse {
  totalCount: number;
  hasNextPage: boolean;
  nodes: Call[];
}

export type CallResponse = Call;

export type ArchiveCallResponse = Call;

export interface Call {
  id: string;
  direction: Direction;
  from: string;
  to: string;
  duration: number;
  is_archived: boolean;
  call_type: CallType;
  via: string;
  created_at: string;
  notes: Note[];
}

export interface Note {
  id: string;
  content: string;
}

export enum Direction {
  Inbound = 'inbound',
  Outbound = 'outbound',
}

export enum CallType {
  Missed = 'missed',
  Answered = 'answered',
  Voicemail = 'voicemail',
}
