import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../../api/BASE_URL";

export const actGetLevelsAndSemesters = createAsyncThunk(
  "allLevels/fetchAllLevelsAndSemesters",
  async (
    { token, planId, academicYearId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Admin/all-plans-levels-semesters-courses/${planId}/${academicYearId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.errors || "Something went wrong"
      );
    }
  }
);
