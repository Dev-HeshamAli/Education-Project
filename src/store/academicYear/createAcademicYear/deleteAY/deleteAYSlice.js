// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteAY } from "./actDeleteAY";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteAYSlice = createSlice({
  name: "deleteAY",
  initialState,
  reducers: {
    clearMessageDeleteAcademicYear: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteAY.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteAY.fulfilled, (state) => {
        state.loading = false;
        state.success = "Academic Year deleted successfully";
      })
      .addCase(actDeleteAY.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ;
      });
  },
});

export const { clearMessageDeleteAcademicYear } = deleteAYSlice.actions; 
export default deleteAYSlice.reducer;
