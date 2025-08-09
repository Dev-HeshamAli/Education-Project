import { createSlice } from "@reduxjs/toolkit";
import { actGetStudentIdByClass } from "./actGetStudentIdByClass";


const studentIdByClassSlice = createSlice({
  name: "studentIdByClassSlice",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetStudentIdByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetStudentIdByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetStudentIdByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = studentIdByClassSlice.actions;
export default studentIdByClassSlice.reducer;