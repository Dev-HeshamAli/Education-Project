// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteLecLink } from "./actDeleteLecLink";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteLecLinkSlice = createSlice({
  name: "deleteLecLink",
  initialState,
  reducers: {
    resetDeleteLinkState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteLecLink.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteLecLink.fulfilled, (state) => {
        state.loading = false;
        state.success = "Link Deleted successfully";
      })
      .addCase(actDeleteLecLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeleteLinkState } = deleteLecLinkSlice.actions;
export default deleteLecLinkSlice.reducer;
