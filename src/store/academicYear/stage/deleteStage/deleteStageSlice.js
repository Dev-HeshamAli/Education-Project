// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteStage } from "./actDeleteStage";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteStageSlice = createSlice({
  name: "deleteStage",
  initialState,
  reducers: {
    resetDeleteStageState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteStage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteStage.fulfilled, (state) => {
        state.loading = false;
        state.success = "Stage deleted successfully";
      })
      .addCase(actDeleteStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ;
      });
  },
});

export const { resetDeleteStageState } = deleteStageSlice.actions; 
export default deleteStageSlice.reducer;
