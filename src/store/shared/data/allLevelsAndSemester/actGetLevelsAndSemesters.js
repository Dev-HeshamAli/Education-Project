import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";

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
