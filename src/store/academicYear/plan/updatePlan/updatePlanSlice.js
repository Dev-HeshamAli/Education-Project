import { createSlice } from "@reduxjs/toolkit";
import { actUpdatePlan } from "./actUpdatePlan";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updatePlanSlice = createSlice({
  name: "planLevel/update",
  initialState,
  reducers: {
    resetUpdatePlanState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdatePlan.fulfilled, (state) => {
        state.loading = false;
        state.success = " Plan updated successfully.";
        state.error = null;
      })
      .addCase(actUpdatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
        state.success = false;
      });
  },
});

export const { resetUpdatePlanState } = updatePlanSlice.actions;
export default updatePlanSlice.reducer;
