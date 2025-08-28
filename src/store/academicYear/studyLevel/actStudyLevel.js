// src/store/studyLevel/studyLevelActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

// ✅ إرسال البيانات
export const actStudyLevel = createAsyncThunk(
  "studyLevel/create",
  async ({ data ,token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/create-study-level`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.errors || "Something went wrong");
    }
  }
);
