import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actCreateScheduleDay = createAsyncThunk(
  "actCreateScheduleDay/create",
  async ({ token, data}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Admin/create-schedule-day`,
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
        error.response?.data?.errors || "Failed to create schedule day";
      return rejectWithValue(message);
    }
  }
);
