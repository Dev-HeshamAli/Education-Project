import { createSlice } from "@reduxjs/toolkit";
import { actDeleteCourseVideo } from "./actDeleteCourseVideo";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteCourseVideoSlice = createSlice({
  name: "video/delate",
  initialState,
  reducers: {
    resetDeleteVideoState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteCourseVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteCourseVideo.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(actDeleteCourseVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
        state.success = false;
      });
  },
});

export const { resetDeleteVideoState } = deleteCourseVideoSlice.actions;
export default deleteCourseVideoSlice.reducer;
