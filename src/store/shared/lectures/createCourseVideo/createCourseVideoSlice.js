import { createSlice } from "@reduxjs/toolkit";
import { actCreateCourseVideo } from "./actCreateCourseVideo";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const createCourseVideoSlice = createSlice({
  name: "video/create",
  initialState,
  reducers: {
    resetCreateVideoState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreateCourseVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actCreateCourseVideo.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(actCreateCourseVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
        state.success = false;
      });
  },
});

export const { resetCreateVideoState } = createCourseVideoSlice.actions;
export default createCourseVideoSlice.reducer;
