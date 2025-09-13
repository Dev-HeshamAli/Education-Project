// src/store/admin/updateAdmin/adminDataSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actGetStudentsInClass } from "./actGetStudentsInClass";

const initialState = {
  loading: false,
  error: null,
  list: [],
};

const studentsInClass = createSlice({
  name: "teacherInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetStudentsInClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetStudentsInClass.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        
      })
      .addCase(actGetStudentsInClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default studentsInClass.reducer;