export interface userState {
  token: string;
}

export interface userAction {
  type: "login" | "logout";
  payload: string;
}
