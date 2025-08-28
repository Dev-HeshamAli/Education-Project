import { createSlice } from "@reduxjs/toolkit";
import { actGetAllLevelsInPlan } from "./actGetAllLevelsInPlan";


const levelsInPlanSlice = createSlice({
  name: "plans",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetAllLevelsInPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetAllLevelsInPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetAllLevelsInPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = levelsInPlanSlice.actions;
export default levelsInPlanSlice.reducer;