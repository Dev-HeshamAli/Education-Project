// src/store/plan/createPlanSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actCreatePlan } from "./actPlan";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const createPlanSlice = createSlice({
  name: "plan/create",
  initialState,
  reducers: {
    resetCreatePlanState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actCreatePlan.fulfilled, (state) => {
        state.loading = false;
        state.success = "Plan created successfully.";
        state.error = null;
      })
      .addCase(actCreatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
        state.success = false;
      });
  },
});

export const { resetCreatePlanState } = createPlanSlice.actions;
export default createPlanSlice.reducer;
