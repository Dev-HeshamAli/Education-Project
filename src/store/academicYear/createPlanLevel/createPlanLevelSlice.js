import { createSlice } from "@reduxjs/toolkit";
import { actCreatePlanLevel } from "./actCreatePlanLevel";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const createPlanLevelSlice = createSlice({
  name: "planLevel/create",
  initialState,
  reducers: {
    resetCreateStudyLevelState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreatePlanLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actCreatePlanLevel.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(actCreatePlanLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
        state.success = false;
      });
  },
});

export const { resetCreateStudyLevelState } = createPlanLevelSlice.actions;
export default createPlanLevelSlice.reducer;
