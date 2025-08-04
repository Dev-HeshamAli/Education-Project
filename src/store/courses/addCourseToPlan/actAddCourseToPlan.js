// src/store/addCourseToPlan/actAddCourseToPlan.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://edu-smart.runasp.net"; // عدله لو مختلف

export const actAddCourseToPlan = createAsyncThunk(
  "planCourse/add",
  async ({ courseId, planId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(` ${API_URL}/api/Admin/add-course-to-plan/${courseId}/${planId}`,null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error Adding Course to Plan:", error.response?.data?.errors || error.message);
      return rejectWithValue(error.response?.data?.errors || "Something went wrong");
    }
  }
);
