// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

    const API_BASE_URL = "https://edu-smart.runasp.net";

// ✅ Create School Class
export const actDeleteSchedule = createAsyncThunk(
  "DeleteSchedule/delete",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/Admin/delete-schedule/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to delete Schedule class";
      return rejectWithValue(message);
    }
  }
);
