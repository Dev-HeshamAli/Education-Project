// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../../api/BASE_URL";

// ✅ Create School Class
export const actDeleteAdmin = createAsyncThunk(
  "deleteAdmin/delete",
  async ({ token, id ,superAdminId}, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Admin/delete-admin/${id}/${superAdminId}`,
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
        error.response?.data?.title ||
        "Failed to delete admin";
      return rejectWithValue(message);
    }
  }
);
