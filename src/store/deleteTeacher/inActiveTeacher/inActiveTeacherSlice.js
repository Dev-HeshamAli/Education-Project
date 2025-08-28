import { createSlice } from "@reduxjs/toolkit";
import { actGetInActiveTeacher } from "./actGetInActiveTeacher";


const inActiveTeacherSlice = createSlice({
  name: "inActiveTeacher",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetInActiveTeacherState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetInActiveTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetInActiveTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetInActiveTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetInActiveTeacherState } = inActiveTeacherSlice.actions;
export default inActiveTeacherSlice.reducer;