
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../../api/BASE_URL";

export const actGetTeacherInfo = createAsyncThunk(
  "teacher/getTeacherInfo",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Teacher/teacher-profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to fetch admin data";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
