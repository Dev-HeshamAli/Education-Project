// src/store/admin/updateAdmin/adminDataSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actGetTeacherInfo } from "./actGetTeacherInfo";

const initialState = {
  loading: false,
  error: null,
  list: [],
};

const teacherInfoSlice = createSlice({
  name: "teacherInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetTeacherInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetTeacherInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        
      })
      .addCase(actGetTeacherInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default teacherInfoSlice.reducer;