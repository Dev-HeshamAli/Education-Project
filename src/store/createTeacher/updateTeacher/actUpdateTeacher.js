// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actUpdateTeacher = createAsyncThunk(
  "actUpdateTeacher/updateTeacher",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/Teacher/Update-teacher`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
        "Failed to update teacher";
      return rejectWithValue(message);
    }
  }
);
