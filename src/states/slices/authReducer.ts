/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { ProfilePayload, UserPayload } from "../../types";

export interface AuthenticationState {
  user: UserPayload | null;
  token: string | null;
  refreshToken?: string;
  profileUpdate: ProfilePayload | null;
  globalLoading: boolean;
  username: string;
}

const initialState: AuthenticationState = {
  user: null,
  username: "",
  token: null,
  refreshToken: "",
  profileUpdate: null,
  globalLoading: false,
};

export const AuthSlice = createSlice({
  initialState,
  name: "auths",
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setUser: (state, action: PayloadAction<UserPayload>) => {
      state.user = action.payload;
    },
    setProfileUpdate: (state, action: PayloadAction<ProfilePayload>) => {
      state.profileUpdate = action.payload;
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
      state.profileUpdate = null;
    },
  },
});

export const {
  setUser,
  setUserName,
  setToken,
  reset,
  setRefreshToken,
  setProfileUpdate,
} = AuthSlice.actions;

export const selectUser = (state: RootState) => state.auths.user;
export const selectUserName = (state: RootState) => state.auths.username;
export const selectToken = (state: RootState) => state.auths.token;
export const selectProfile = (state: RootState) => state.auths.profileUpdate;
export const selectRefreshToken = (state: RootState) =>
  state.auths.refreshToken;

export const authReducer = AuthSlice.reducer;
