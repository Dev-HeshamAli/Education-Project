import { createSlice } from "@reduxjs/toolkit";
import { actDashboardInfo } from "./actDashboardInfo";


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDashboardInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actDashboardInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actDashboardInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;