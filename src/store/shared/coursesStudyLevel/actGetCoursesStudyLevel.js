import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";


export const fetchCoursesStudyLevels = createAsyncThunk(
  "coursesStudyLevel/fetchCoursesStudyLevels",
  async ({token, id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Admin/Courses-StudyLevel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.errors || "Something went wrong");
    }
  }
);