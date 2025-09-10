import { createSlice } from "@reduxjs/toolkit";
import { actGetlectures } from "./actGetlectures";


const lecturesSlice = createSlice({
  name: "lectures",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetlectures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetlectures.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetlectures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = lecturesSlice.actions;
export default lecturesSlice.reducer;