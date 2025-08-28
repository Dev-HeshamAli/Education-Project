import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./PostUserData";


const tokenFromStorage = localStorage.getItem("token");
const id = localStorage.getItem("id");
const role = JSON.parse(localStorage.getItem("role"));

const initialState = {
  token: tokenFromStorage || null,
  role: role  || null,
  id: id || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
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




export const { logout, resetLoginMessages } = authSlice.actions;

export default authSlice.reducer;

