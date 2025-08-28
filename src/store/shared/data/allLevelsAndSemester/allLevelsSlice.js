import { createSlice } from "@reduxjs/toolkit";
import { actGetLevelsAndSemesters } from "./actGetLevelsAndSemesters";


const allLevelsSlice = createSlice({
  name: "allLevels",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetLevelsAndSemesters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetLevelsAndSemesters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetLevelsAndSemesters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default allLevelsSlice.reducer;