import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  token: string;
}

const initialState: User = {
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state, action: PayloadAction) => {
      state.token = "";
    },
  },
});
