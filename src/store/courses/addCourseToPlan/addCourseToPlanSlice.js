// src/store/addCourseToPlan/addCourseToPlanSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actAddCourseToPlan } from "./actAddCourseToPlan";

const addCourseToPlanSlice = createSlice({
  name: "addCourseToPlan",
  initialState: {
    loading: false,
    successMessage: null,
    errorMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actAddCourseToPlan.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(actAddCourseToPlan.fulfilled, (state,) => {
        state.loading = false;
        state.successMessage = "Course added to plan successfully";
        state.errorMessage = null;
      })
      .addCase(actAddCourseToPlan.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = null;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearMessages } = addCourseToPlanSlice.actions;
export default addCourseToPlanSlice.reducer;
