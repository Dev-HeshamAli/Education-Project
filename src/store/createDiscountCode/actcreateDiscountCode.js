
// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const actCreateDiscountCode = createAsyncThunk(
  "createDiscountCode/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/create-discount-code`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.errors || error.response?.data?.message || "Failed to create teacher";
      return rejectWithValue(message);
    }
  }
);