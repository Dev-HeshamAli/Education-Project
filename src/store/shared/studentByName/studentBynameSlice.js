import { createSlice } from "@reduxjs/toolkit";
import { actGetStudentByName } from "./actGetStudentByName";


const studentByNameSlice = createSlice({
  name: "studentByNameSlice",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetStudentByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetStudentByName.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetStudentByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentByNameSlice.reducer;