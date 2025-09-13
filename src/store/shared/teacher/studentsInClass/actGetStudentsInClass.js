
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../../api/BASE_URL";

export const actGetStudentsInClass = createAsyncThunk(
  "student/actGetStudentsInClass",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Teacher/teacher-classes-and-students/${id}`,
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
