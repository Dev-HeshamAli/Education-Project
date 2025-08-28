import { createSlice } from "@reduxjs/toolkit";
import { fetchSchoolClassId } from "./actGetSchoolClassId";


const schoolClassIdSlice = createSlice({
  name: "schoolClassId",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetCreateSchoolClassState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolClassId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolClassId.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSchoolClassId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCreateSchoolClassState } = schoolClassIdSlice.actions;
export default schoolClassIdSlice.reducer;