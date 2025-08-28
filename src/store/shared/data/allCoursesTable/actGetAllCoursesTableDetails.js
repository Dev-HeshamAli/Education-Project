import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../../api/BASE_URL";

export const actGetAllCoursesTableDetails = createAsyncThunk(
  "allCoursesTableDetails/fetchAllCoursesTableDetails",
  async (
    { token, planId, semesterId, studyLevelId, academicYearId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Admin/All-coursesTable-in-plan-level-semester/${planId}/${studyLevelId}/${semesterId}/${academicYearId}`,
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
