import { createSlice } from "@reduxjs/toolkit";
import { fetchAcademicYears } from "./actGetAcademicYears";


const academicYearsSlice = createSlice({
  name: "academicYears",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicYears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAcademicYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = academicYearsSlice.actions;
export default academicYearsSlice.reducer;