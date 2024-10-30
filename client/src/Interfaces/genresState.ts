import { Genre } from "./genre";

export interface genresState {
  genres: Genre[];
}

export interface genresAction {
  type: "setGenres";
  payload: Genre[];
}
