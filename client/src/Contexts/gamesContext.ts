import { createContext, Dispatch, useContext } from "react";
import { gamesAction, gamesState } from "../Interfaces/gamesState";

interface GamesContextType {
  gamesState: gamesState;
  gamesDispatch: Dispatch<gamesAction>;
}

export const GamesContext = createContext<GamesContextType | undefined>(
  undefined
);

export function useGamesContext() {
  const context = useContext(GamesContext);
  if (context === undefined) {
    throw new Error("useGamesContext must be used with a UserContext");
  }

  return context;
}
