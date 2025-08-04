import { createSlice } from "@reduxjs/toolkit";
import { actUpdatePlanLevel } from "./actUpdatePlanLevel";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updatePlanLevelSlice = createSlice({
  name: "planLevel/update",
  initialState,
  reducers: {
    resetUpdatePlanLevelState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdatePlanLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdatePlanLevel.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(actUpdatePlanLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
        state.success = false;
      });
  },
});

export const { resetUpdatePlanLevelState } = updatePlanLevelSlice.actions;
export default updatePlanLevelSlice.reducer;
