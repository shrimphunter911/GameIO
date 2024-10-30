import { createContext, Dispatch, useContext } from "react";
import { genresAction, genresState } from "../Interfaces/GenresState";

interface GenressContextType {
  genresState: genresState;
  genresDispatch: Dispatch<genresAction>;
}

export const GenresContext = createContext<GenressContextType | undefined>(
  undefined
);

export function useGenresContext() {
  const context = useContext(GenresContext);
  if (context === undefined) {
    throw new Error("useGenresContext must be used with a UserContext");
  }

  return context;
}
