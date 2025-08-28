
// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const actUpdateJobDiscount = createAsyncThunk(
  "updateJobDiscount/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/Admin/update-job-discount`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.log("Error:", error.response?.title);
      const message = error.response?.data?.errors || error.response?.data?.message || "Failed to Update Job Discount";
      return rejectWithValue(message);
    }
  }
);