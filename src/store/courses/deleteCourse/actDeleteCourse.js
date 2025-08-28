// src/store/shared/deleteCourse/actDeleteCourse.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://edu-smart.runasp.net"
export const actDeleteCourse = createAsyncThunk(
  "deleteCourse/delete",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/Admin/delete-course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Delete error:", error.response?.data?.errors || error.message);
      return rejectWithValue(error.response?.data?.errors || "Something went wrong");
    }
  }
);
