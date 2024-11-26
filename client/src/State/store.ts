import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./gamesSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: { games: gamesReducer, user: userReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
