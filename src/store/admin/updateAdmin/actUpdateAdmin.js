

// adminActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

// ✅ Update Admin API Call
export const actUpdateAdmin = createAsyncThunk(
  "admin/actUpdateAdmin",
  async ({adminData, token}, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/Admin/update-Admin`,
        adminData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to update admin data";
      return thunkAPI.rejectWithValue(message);
    }
  }
);