// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const actDeleteStage = createAsyncThunk(
  "deleteStage/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/Admin/delete-stage/${id}`,
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
        error.response?.data?.errors ||
        "Failed to Delete Academic Year";
      return rejectWithValue(message);
    }
  }
);
