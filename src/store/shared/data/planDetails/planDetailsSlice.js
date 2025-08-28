import { createSlice } from "@reduxjs/toolkit";
import { actGetPlanDetails } from "./actGetPlanDetails";


const plansDetailsSlice = createSlice({
  name: "planDetails",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetPlanDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetPlanDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetPlanDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = plansDetailsSlice.actions;
export default plansDetailsSlice.reducer;