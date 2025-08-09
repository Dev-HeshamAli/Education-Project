// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

    const API_BASE_URL = "https://edu-smart.runasp.net";

// ✅ Create School Class
export const actDeleteSchoolClass = createAsyncThunk(
  "DeleteSchoolClass/delete",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/Admin/delete-school-class/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete school class";
      return rejectWithValue(message);
    }
  }
);
