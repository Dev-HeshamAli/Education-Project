import { createSlice } from "@reduxjs/toolkit";
import { actGetLectureVideo } from "./actGetLectureVideo";


const lecturesVideoSlice = createSlice({
  name: "lectureVideo",
  initialState: {
    video: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetLectureVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetLectureVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload;
      })
      .addCase(actGetLectureVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = lecturesVideoSlice.actions;
export default lecturesVideoSlice.reducer;