import { createSlice } from "@reduxjs/toolkit";
import { actActiveAcademicYear } from "./actActiveAcademicYear";


const activeAcademicYearSlice = createSlice({
  name: "ActiveAcademicYears",
  initialState: {
    active: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actActiveAcademicYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actActiveAcademicYear.fulfilled, (state, action) => {
        state.loading = false;
        state.active = action.payload;
      })
      .addCase(actActiveAcademicYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = activeAcademicYearSlice.actions;
export default activeAcademicYearSlice.reducer;