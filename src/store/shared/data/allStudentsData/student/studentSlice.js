import { createSlice } from "@reduxjs/toolkit";
import { actGetStudents } from "./actGetStudents";


const studentSlice = createSlice({
  name: "students",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentSlice.reducer;