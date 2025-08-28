import { createSlice } from "@reduxjs/toolkit";
import { actUpdateStudyLevel } from "./actUpdateStudyLevel";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateStudyLevelSlice = createSlice({
  name: "studyLevel/update",
  initialState,
  reducers: {
    resetUpdateStudyLevelState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateStudyLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdateStudyLevel.fulfilled, (state) => {
        state.loading = false;
        state.success = "Study level updated successfully.";
        state.error = null;
      })
      .addCase(actUpdateStudyLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
        state.success = false;
      });
  },
});

export const { resetUpdateStudyLevelState } = updateStudyLevelSlice.actions;
export default updateStudyLevelSlice.reducer;
