import { createSlice } from "@reduxjs/toolkit";
import { fetchTeachersByName } from "./actGetTeacherByName";


const teacherByNameSlice = createSlice({
  name: "teacherByNameSlice",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachersByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachersByName.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTeachersByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = teacherByNameSlice.actions;
export default teacherByNameSlice.reducer;