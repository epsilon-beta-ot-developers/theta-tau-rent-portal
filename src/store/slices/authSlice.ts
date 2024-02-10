import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  email: string;
  id: number;
  name: string;
  role: "user" | "admin";
};

type AuthSliceState = {
  user?: AuthUser;
};

export type AuthLoginPayload = {
  email: string;
  password: string;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {} as AuthSliceState,
  reducers: {
    login(state, action: PayloadAction<AuthLoginPayload>) {
      if (
        action.payload.email == "user@ebthetatauhousing.org" &&
        action.payload.password === "user"
      ) {
        state.user = {
          email: action.payload.email,
          id: 1,
          name: "User",
          role: "user",
        };
      } else if (
        action.payload.email === "admin@ebthetatauhousing.org" &&
        action.payload.password === "admin"
      ) {
        state.user = {
          email: action.payload.email,
          id: 2,
          name: "Admin",
          role: "admin",
        };
      }
    },
    logout(state) {
      state.user = undefined;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { login, logout } = authSlice.actions;
