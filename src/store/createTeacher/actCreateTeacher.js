
// src/store/createTeacher/actCreateTeacher.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const actCreateTeacher = createAsyncThunk(
  "createTeacher/create", // ⚠️ صحح الاسم هنا
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Teacher/Create-teacher`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.log("Error:", error.response?.data);
      const message = error.response?.data?.errors || error.response?.data?.message || "Failed to create teacher";
      return rejectWithValue(message);
    }
  }
);