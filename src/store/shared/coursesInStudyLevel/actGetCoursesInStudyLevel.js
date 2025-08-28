import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../api/BASE_URL";

export const actGetCoursesInStudyLevel = createAsyncThunk(
  "coursesInStudyLevel/fetchCoursesInStudyLevels",
  async ({ token, studyLevelId, planId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Admin/courses-in-study-level/${planId}/${studyLevelId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return { list: [] };
      }
      return rejectWithValue(
        err.response?.data?.errors || "Something went wrong"
      );
    }
  }
);
