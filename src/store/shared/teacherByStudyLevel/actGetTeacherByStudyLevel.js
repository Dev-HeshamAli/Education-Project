import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";


export const fetchTeachersByStudyLevel = createAsyncThunk(
  "teacher/fetchTeachersByStudyLevel",
  async ({token, id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Shared/Teachers-StudyLevel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.title || "Something went wrong");
    }
  }
);