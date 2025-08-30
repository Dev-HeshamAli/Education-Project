// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../api/BASE_URL";

export const actCreateTeacher = createAsyncThunk(
  "createTeacher/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Teacher/Create-teacher`,
        data,
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
        error.response?.data?.errors.CVPath ||
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Failed to create teacher";
      return rejectWithValue(message);
    }
  }
);
