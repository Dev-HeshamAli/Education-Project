// src/store/admin/updateAdmin/adminDataSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actGetStudentInfo } from "./actGetStudentInfo";

const initialState = {
  loading: false,
  error: null,
  list: [],
};

const StudentInfoSlice = createSlice({
  name: "teacherInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetStudentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetStudentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        
      })
      .addCase(actGetStudentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default StudentInfoSlice.reducer;