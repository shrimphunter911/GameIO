import { Game } from "./game";

export interface gamesState {
  games: Game[];
}

export interface gamesAction {
  type: "setGames";
  payload: Game[];
}
