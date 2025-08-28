// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeletePlan } from "./actDeletePlan";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deletePlanSlice = createSlice({
  name: "deletePlan",
  initialState,
  reducers: {
    resetDeletePlanState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeletePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeletePlan.fulfilled, (state) => {
        state.loading = false;
        state.success = "Plan deleted successfully";
      })
      .addCase(actDeletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ;
      });
  },
});

export const { resetDeletePlanState } = deletePlanSlice.actions; 
export default deletePlanSlice.reducer;
