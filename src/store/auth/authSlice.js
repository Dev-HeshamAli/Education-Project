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
        state.refreshToken = action.payload.refreshToken;

        // حفظ في الكوكيز
        CookieService.setCookie("token", action.payload.token, { path: "/" });
        CookieService.setCookie("refreshToken", action.payload.refreshToken, {
          path: "/",
        });
        CookieService.setCookie("expiresIn", action.payload.expiresIn, {
          path: "/",
        });
        CookieService.setCookie(
          "refreshTokenExpiretion",
          action.payload.refreshTokenExpiretion,
          { path: "/" }
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
        state.refreshToken = action.payload.refreshToken;

        // تحديث الكوكيز
        CookieService.setCookie("token", action.payload.token, { path: "/" });
        CookieService.setCookie("refreshToken", action.payload.refreshToken, {
          path: "/",
        });
        CookieService.setCookie("expiresIn", action.payload.expiresIn, {
          path: "/",
        });
        CookieService.setCookie(
          "refreshTokenExpiretion",
          action.payload.refreshTokenExpiretion,
          { path: "/" }
        );
      })
      .addCase(actRefreshAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // console.error("Refresh token failed:", action.payload);
      });
  },
});

export const { logout, resetLoginMessages } = authSlice.actions;
export default authSlice.reducer;
