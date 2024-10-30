import { gamesAction, gamesState } from "../Interfaces/gamesState";

export const gamesReducer = (state: gamesState, action: gamesAction) => {
  const { type, payload } = action;

  switch (type) {
    case "setGames":
      return { ...state, games: payload };
    default:
      return state;
  }
};
