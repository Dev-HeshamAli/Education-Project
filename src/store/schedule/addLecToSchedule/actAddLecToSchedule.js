
// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const actAddLecToSchedule = createAsyncThunk(
  "addLecToSchedule/add",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/add-lec-to-schedule`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.log("Error:", error.response?.title);
      const message = error.response?.data?.errors || error.response?.data?.message || "Failed to  Add Lec To Schedule";
      return rejectWithValue(message);
    }
  }
);