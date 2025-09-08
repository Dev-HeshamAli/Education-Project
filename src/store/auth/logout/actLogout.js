// src/store/deleteCourseFromAY/actDeleteCourseFromAcademicYear.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actLogout = createAsyncThunk(
  "actLogout/logout",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Auth/Logout`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.errors || "Unknown error occurred"
      );
    }
  }
);
