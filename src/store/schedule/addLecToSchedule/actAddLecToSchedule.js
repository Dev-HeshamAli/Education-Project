
// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actAddLecToSchedule = createAsyncThunk(
  "addLecToSchedule/add",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Admin/add-lec-to-schedule`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.errors || error.response?.data?.message || "Failed to  Add Lec To Schedule";
      return rejectWithValue(message);
    }
  }
);