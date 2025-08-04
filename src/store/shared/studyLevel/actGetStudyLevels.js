// ✅ getStudyLevels.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://edu-smart.runasp.net";
export const fetchStudyLevels = createAsyncThunk(
  "studyLevel/fetchStudyLevels",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Shared/StudyLevels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.title || "Something went wrong");
    }
  }
);