// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const actActiveTeacher = createAsyncThunk(
  "ActiveTeacher/active",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/Admin/Active-Teacher/${id}`,
        {}, // body فاضي
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to Active Teacher";
      return rejectWithValue(message);
    }
  }
);
