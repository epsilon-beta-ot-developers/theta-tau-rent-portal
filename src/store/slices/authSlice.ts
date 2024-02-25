import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { createSlice } from "@reduxjs/toolkit";

export type AuthUser = {
  email: string;
  phoneNumber: string;
  role: "user" | "admin";
  username: string;
};

type AuthSliceState = {
  user?: AuthUser;
};

type CognitoUserPayload = {
  at_hash: string;
  aud: string;
  auth_time: number;
  "cognito:username": string;
  email: string;
  email_verified: boolean;
  event_id: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  origin_jti: string;
  phone_number: string;
  sub: string;
  token_use: string;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {} as AuthSliceState,
  reducers: {
    initialize(state) {
      const userIdToken = Cookies.get("user_id_token");

      if (userIdToken) {
        const decodedUserId: CognitoUserPayload =
          jwtDecode<CognitoUserPayload>(userIdToken);

        state.user = {
          email: decodedUserId.email,
          phoneNumber: decodedUserId.phone_number,
          role: "admin",
          username: decodedUserId["cognito:username"],
        };
      }
    },
    logout() {
      window.location.replace("https://portal.ebthetatauhousing.org/logout");
    },
  },
});

export const authReducer = authSlice.reducer;
export const { initialize, logout } = authSlice.actions;
