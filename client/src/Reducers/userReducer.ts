import { userAction, userState } from "../Interfaces/userState";

export const userReducer = (state: userState, action: userAction) => {
  const { type, payload } = action;

  switch (type) {
    case "login":
      return { ...state, token: payload };
    case "logout":
      return { ...state, token: "" };
    default:
      return state;
  }
};
