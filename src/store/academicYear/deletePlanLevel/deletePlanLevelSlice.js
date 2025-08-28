// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeletePlanLevel } from "./actDeletePlanLevel";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deletePlanLevelSlice = createSlice({
  name: "deletePlanLevel",
  initialState,
  reducers: {
    resetDeletePlanLevelState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeletePlanLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeletePlanLevel.fulfilled, (state) => {
        state.loading = false;
        state.success = "Plan Level Deleted successfully";
      })
      .addCase(actDeletePlanLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeletePlanLevelState } = deletePlanLevelSlice.actions;
export default deletePlanLevelSlice.reducer;
