import { createSlice } from "@reduxjs/toolkit";
import { actGetAllAdmins } from "./actGetAllAdmins";


const allAdminsSlice = createSlice({
  name: "allAdmins",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetAllAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetAllAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = allAdminsSlice.actions;
export default allAdminsSlice.reducer;