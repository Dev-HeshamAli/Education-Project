import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./PostUserData";
import CookieService from "../../utils/cookies";
import {actRefreshAuth} from "./actRefreshAuth";

const initialState = {
  token: "",
  refreshToken: "",
  role: "",
  id: "",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = "";
      state.refreshToken = "";
      state.role = "";
      state.id = "";
      CookieService.removeCookie("token", { path: "/" });
      CookieService.removeCookie("refreshToken", { path: "/" });
    },
    resetLoginMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.roles;
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.refreshToken = action.payload.refreshToken;

        CookieService.setCookie("token", action.payload.token, { path: "/" });
        CookieService.setCookie("refreshToken", action.payload.refreshToken, {
          path: "/",
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ✅ Refresh Token
    builder
      .addCase(actRefreshAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actRefreshAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.refreshToken = action.payload.refreshToken;

        CookieService.setCookie("token", action.payload.token, { path: "/" });
        CookieService.setCookie("refreshToken", action.payload.refreshToken, {
          path: "/",
        });
      })
      .addCase(actRefreshAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetLoginMessages } = authSlice.actions;

export default authSlice.reducer;
