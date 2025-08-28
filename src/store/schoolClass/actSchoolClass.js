// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

    const API_BASE_URL = "https://edu-smart.runasp.net";

// ✅ Create School Class
export const actSchoolClass = createAsyncThunk(
  "schoolClass/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/create-school-class`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create school class";
      return rejectWithValue(message);
    }
  }
);
