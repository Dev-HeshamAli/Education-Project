// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../api/BASE_URL";

// ✅ Create School Class
export const actDeleteTeacher = createAsyncThunk(
  "DeleteTeacher/delete",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Teacher/Delete-teacher/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to delete Teacher class";
      return rejectWithValue(message);
    }
  }
);
