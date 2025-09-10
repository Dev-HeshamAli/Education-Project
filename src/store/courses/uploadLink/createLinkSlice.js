// src/store/course/courseSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actCreateLink } from "./actCreateLink";

const createLinkSlice = createSlice({
  name: "Link",
  initialState: {
    loading: false,
    successMessage: null,
    errorMessage: null,
  },
  reducers: {
    clearCreateLinkMessagesSuccess: (state) => {
      state.successMessage = null;
    },
    clearCreateLinkMessagesError: (state) => {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreateLink.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(actCreateLink.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Link created successfully";
        state.errorMessage = null;
      })
      .addCase(actCreateLink.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = null;
        state.errorMessage = action.payload 
      });
  },
});

export const { clearCreateLinkMessagesSuccess, clearCreateLinkMessagesError } = createLinkSlice.actions;
export default createLinkSlice.reducer;
