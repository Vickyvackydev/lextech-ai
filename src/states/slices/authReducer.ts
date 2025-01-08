/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { UserPayload } from "../../types";

export interface AuthenticationState {
  user: UserPayload | null;
  token: string | null;
  refreshToken?: string;

  globalLoading: boolean;
}

const initialState: AuthenticationState = {
  user: null,
  token: null,
  refreshToken: "",

  globalLoading: false,
};

export const AuthSlice = createSlice({
  initialState,
  name: "auths",
  reducers: {
    setUser: (state, action: PayloadAction<UserPayload>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },

    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    reset: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, reset, setRefreshToken } = AuthSlice.actions;

export const selectUser = (state: RootState) => state.auths.user;
export const selectToken = (state: RootState) => state.auths.token;
export const selectRefreshToken = (state: RootState) =>
  state.auths.refreshToken;

export const authReducer = AuthSlice.reducer;
