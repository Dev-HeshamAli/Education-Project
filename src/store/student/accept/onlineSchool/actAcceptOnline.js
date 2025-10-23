// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../../api/BASE_URL";

// ✅ Create School Class
export const actAcceptOnline = createAsyncThunk(
  "act/acceptOnline",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Subscription/enroll-student-in-Onlin-School`,
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
        error.response?.data?.errors ||
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Failed to Accept student";
      return rejectWithValue(message);
    }
  }
);