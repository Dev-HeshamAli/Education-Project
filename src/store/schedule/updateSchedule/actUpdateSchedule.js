// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const actUpdateSchedule = createAsyncThunk(
  "actUpdateSchedule/update",
  async ({ token, data}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/Admin/update-schedule`,
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
        error.response?.data?.errors[1]  || "Failed to update schedule";
      return rejectWithValue(message);
    }
  }
);
