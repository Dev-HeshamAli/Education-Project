// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actDeleteDiscountCode = createAsyncThunk(
  "deleteDiscountCode/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Admin/delete-discount-code/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        "Failed to Delete Job Discount";
      return rejectWithValue(message);
    }
  }
);
