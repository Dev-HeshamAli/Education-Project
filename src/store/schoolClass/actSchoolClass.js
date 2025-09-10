// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../api/BASE_URL";

// ✅ Create School Class
export const actSchoolClass = createAsyncThunk(
  "schoolClass/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Admin/create-school-class`,
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
