import { createSlice } from "@reduxjs/toolkit";
import { actanyCourseNameLevel } from "./actanyCourseNameLevel";


const anyCourseNameSlice = createSlice({
  name: "anyCourseNameSlice",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actanyCourseNameLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actanyCourseNameLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actanyCourseNameLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
  export const { resetPlansState } = anyCourseNameSlice.actions;
  
export default anyCourseNameSlice.reducer;