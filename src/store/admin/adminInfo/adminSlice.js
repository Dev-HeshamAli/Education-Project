import { createSlice } from "@reduxjs/toolkit";
import { actGetAdmin } from "./actGetAdmin";


const adminSlice = createSlice({
  name: "adminInfo",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = adminSlice.actions;
export default adminSlice.reducer;