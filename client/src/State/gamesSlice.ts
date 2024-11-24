import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game } from "../Interfaces/game";

const initialState: Game[] = [];

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setGames: (state, action: PayloadAction<Game[]>) => {
      return action.payload;
    },
    addGames: (state, action: PayloadAction<Game | Game[]>) => {
      const newGames = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.push(...newGames);
    },
    editGame: (state, action: PayloadAction<Game>) => {
      const index = state.findIndex((game) => game.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removeGame: (state, action: PayloadAction<number>) => {
      return state.filter((game) => game.id !== action.payload);
    },
  },
});

export const { setGames, addGames, editGame, removeGame } = gamesSlice.actions;

export default gamesSlice.reducer;
