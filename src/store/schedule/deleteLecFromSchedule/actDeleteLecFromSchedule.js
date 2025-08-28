// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

    const API_BASE_URL = "https://edu-smart.runasp.net";

// ✅ Create School Class
export const actDeleteLecFromSchedule = createAsyncThunk(
  "deleteLecFromSchedule/delete",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/Admin/Delete-lec-to-schedule/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors[1] || "Failed to delete Lec From Schedule class";
      return rejectWithValue(message);
    }
  }
);
