
// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actUpdateJobDiscount = createAsyncThunk(
  "updateJobDiscount/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/Admin/update-job-discount`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.errors || error.response?.data?.message || "Failed to Update Job Discount";
      return rejectWithValue(message);
    }
  }
);