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
  clientId: string;
  loadUserAttempted: boolean;
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
  initialState: {
    loadUserAttempted: false,
  } as AuthSliceState,
  reducers: {
    loadUser(state) {
      const userIdToken = Cookies.get("id_token");
      const clientId = Cookies.get("client_id");
      state.loadUserAttempted = true;

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
      if (clientId) {
        state.clientId = clientId;
      }
    },
    logout(state) {
      window.location.replace(
        `https://rent-portal-login.auth.us-east-1.amazoncognito.com/logout?response_type=code&client_id=${state.clientId}&redirect_uri=https%3A%2F%2Fportal.ebthetatauhousing.org%2Fparse-auth`
      );
    },
  },
});

export const authReducer = authSlice.reducer;
export const { loadUser, logout } = authSlice.actions;
