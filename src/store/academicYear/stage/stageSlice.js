// src/store/plan/createPlanSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actStage } from "./actStage";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const stageSlice = createSlice({
  name: "plan/create",
  initialState,
  reducers: {
    resetCreatePlanState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actStage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actStage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(actStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
        state.success = false;
      });
  },
});

export const { resetCreatePlanState } = stageSlice.actions;
export default stageSlice.reducer;
