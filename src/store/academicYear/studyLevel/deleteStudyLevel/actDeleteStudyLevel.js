// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const actDeleteStudyLevel = createAsyncThunk(
  "deleteStudyLevel/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/Admin/delete-study-level/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error:", error.response?.data.errors);
      const message =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        "Failed to Delete Job Discount";
      return rejectWithValue(message);
    }
  }
);
