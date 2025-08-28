import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";

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
