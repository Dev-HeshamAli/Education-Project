import { createSlice } from "@reduxjs/toolkit";
import { actGetParent } from "./actGetParent";


const parentSlice = createSlice({
  name: "parents",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetParent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetParent.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default parentSlice.reducer;