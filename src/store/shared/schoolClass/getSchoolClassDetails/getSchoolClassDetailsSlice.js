import { createSlice } from "@reduxjs/toolkit";
import { actGetSchoolClassDetails } from "./actGetSchoolClassDetails";


const getSchoolClassDetailsSlice = createSlice({
  name: "schoolClassIdDetails",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetSchoolClassDetailsState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetSchoolClassDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetSchoolClassDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetSchoolClassDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSchoolClassDetailsState } = getSchoolClassDetailsSlice.actions;
export default getSchoolClassDetailsSlice.reducer;