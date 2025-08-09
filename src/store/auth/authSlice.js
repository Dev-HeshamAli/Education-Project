import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./PostUserData";
// import { refreshAccessToken } from "./refreshAccessToken";
const tokenFromStorage = localStorage.getItem("token");
const userInfoFromStorage = localStorage.getItem("userInfo");

const initialState = {
  token: tokenFromStorage || null,
  role: JSON.parse(localStorage.getItem("role")) || null,
  userData: userInfoFromStorage || null, // هنا هنخزن بيانات المستخدم كلها
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("role");
      state.token = null;
      state.userData = null;
    },
    resetLoginMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.roles;
        state.token = action.payload.token;
        state.userData = action.payload; // نخزن كل البيانات
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


// const initialState = {
//   token: null,
//   expiresAt: null,
//   role: null,
//   userData: null,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.token = null;
//       state.userData = null;
//       state.role = null;
//       state.expiresAt = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.role = action.payload.roles;
//         state.userData = action.payload.userInfo;
//         state.expiresAt = Date.now() + action.payload.userInfo.expiresIn * 1000;
//       })
//       .addCase(refreshAccessToken.fulfilled, (state, action) => {
//         state.token = action.payload.token;
//         state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
//       });
//   }
// });

export const { logout, resetLoginMessages } = authSlice.actions;

export default authSlice.reducer;
