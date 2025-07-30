import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./PostUserData";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    loading: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});


export const { logout } = authSlice.actions;

export default authSlice.reducer;
