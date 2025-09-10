import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./PostUserData";
import CookieService from "../../utils/cookies";
import { actRefreshAuth } from "./actRefreshAuth";

const initialState = {
  token: "",
  refreshToken: "",
  role: "",
  id: "",
  loading: false,
  error: null,
  successMessage: null,
  userid: null,
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
      // إزالة الكوكيز
      CookieService.removeCookie("token", { path: "/" });
      CookieService.removeCookie("refreshToken", { path: "/" });
      CookieService.removeCookie("expiresIn", { path: "/" });
      CookieService.removeCookie("refreshTokenExpiretion", { path: "/" });
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
        state.userid = action.payload.userid;
        state.refreshToken = action.payload.refreshToken;

        const expiresIn = parseInt(action.payload.expiresIn);

        CookieService.setCookie("token", action.payload.token, {}, expiresIn);
        CookieService.setCookie(
          "refreshToken",
          action.payload.refreshToken,
          {},
          expiresIn
        );
        CookieService.setCookie(
          "expiresIn",
          action.payload.expiresIn,
          {},
          expiresIn
        );
        CookieService.setCookie(
          "refreshTokenExpiretion",
          action.payload.refreshTokenExpiretion,
          {},
          expiresIn
        );
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
        state.role = action.payload.roles;
        state.token = action.payload.token;
        state.id = action.payload.id;
                state.userid = action.payload.userid;
        state.refreshToken = action.payload.refreshToken;

        const expiresIn = parseInt(action.payload.expiresIn);

        CookieService.setCookie("token", action.payload.token, {}, expiresIn);
        CookieService.setCookie(
          "refreshToken",
          action.payload.refreshToken,
          {},
          expiresIn
        );
        CookieService.setCookie(
          "expiresIn",
          action.payload.expiresIn,
          {},
          expiresIn
        );
        CookieService.setCookie(
          "refreshTokenExpiretion",
          action.payload.refreshTokenExpiretion,
          {},
          expiresIn
        );
      })

      .addCase(actRefreshAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetLoginMessages } = authSlice.actions;
export default authSlice.reducer;
