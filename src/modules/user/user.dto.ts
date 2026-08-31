export interface CreateUserReq {
  username: string;
  email: string;
  password: string;
}

export interface UserRes {
  id: string;
  username: string;
  email: string;
}

export interface UpdateUserReq {
  id: string;
  username?: string;
  email?: string;
}
