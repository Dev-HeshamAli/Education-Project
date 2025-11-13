// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../../api/BASE_URL";

// ✅ Create School Class
export const actOnlineOrOffline = createAsyncThunk(
  "act/actOnlineOrOffline",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Subscription/enroll-student-Course`,
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