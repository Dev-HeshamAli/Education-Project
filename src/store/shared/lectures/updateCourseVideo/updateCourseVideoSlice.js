import { createSlice } from "@reduxjs/toolkit";
import { actUpdateCourseVideo } from "./actUpdateCourseVideo";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateCourseVideoSlice = createSlice({
  name: "video/update",
  initialState,
  reducers: {
    resetUpdateVideoState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateCourseVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdateCourseVideo.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(actUpdateCourseVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
        state.success = false;
      });
  },
});

export const { resetUpdateVideoState } = updateCourseVideoSlice.actions;
export default updateCourseVideoSlice.reducer;
