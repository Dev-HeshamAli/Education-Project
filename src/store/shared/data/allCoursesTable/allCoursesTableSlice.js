import { createSlice } from "@reduxjs/toolkit";
import { actGetAllCoursesTableDetails } from "./actGetAllCoursesTableDetails";


const allCoursesTableSlice = createSlice({
  name: "allCoursesDetails",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetAllCoursesTableDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetAllCoursesTableDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetAllCoursesTableDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = allCoursesTableSlice.actions;
export default allCoursesTableSlice.reducer;