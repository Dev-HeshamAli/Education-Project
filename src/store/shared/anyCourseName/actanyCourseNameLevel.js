import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../api/BASE_URL";

export const actanyCourseNameLevel = createAsyncThunk(
  "coursesInStudyLevel/fetchCoursesInStudyLevels",
  async ({ token, studyLevelId, planId ,semesterId}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Course/AnyCourses-Name/${planId}/${studyLevelId}/${semesterId}`,
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
