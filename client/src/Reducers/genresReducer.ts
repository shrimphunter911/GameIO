import { genresAction, genresState } from "../Interfaces/GenresState";

export const genresReducer = (state: genresState, action: genresAction) => {
  const { type, payload } = action;

  switch (type) {
    case "setGenres":
      return { ...state, genres: payload };
    default:
      return state;
  }
};
