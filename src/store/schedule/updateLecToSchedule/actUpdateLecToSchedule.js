
// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actUpdateLecToSchedule = createAsyncThunk(
  "updateLecToSchedule/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/Admin/update-lec-to-schedule`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.errors[1] || error.response?.data?.message || "Failed to Update Lec To Schedule";
      return rejectWithValue(message);
    }
  }
);