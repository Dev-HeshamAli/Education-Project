import { createSlice } from "@reduxjs/toolkit";
import { actGetCourseDetails } from "./actGetCourseDetails";


const courseDetailsSlice = createSlice({
  name: "courseDetails",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = courseDetailsSlice.actions;
export default courseDetailsSlice.reducer;