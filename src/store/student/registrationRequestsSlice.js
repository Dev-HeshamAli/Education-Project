import { createSlice } from "@reduxjs/toolkit";
import { actRegistrationRequests } from "./actRegistrationRequests";


const registrationRequestsSlice = createSlice({
  name: "registrationRequests",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actRegistrationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actRegistrationRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actRegistrationRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = registrationRequestsSlice.actions;
export default registrationRequestsSlice.reducer;