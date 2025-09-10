
// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../api/BASE_URL";

export const actCreateDiscountCode = createAsyncThunk(
  "createDiscountCode/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Admin/create-discount-code`,
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