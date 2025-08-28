import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";

export const actActiveAcademicYear = createAsyncThunk(
  "academicYears/activeAcademicYears",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/Admin/update-academic-year-status/${id}`, 
        {}, // البودي (فاضي في حالتك)
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors || "Something went wrong");
    }
  }
);
