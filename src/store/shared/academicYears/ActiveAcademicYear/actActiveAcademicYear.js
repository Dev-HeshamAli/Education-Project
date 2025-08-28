import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../../api/BASE_URL";

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
