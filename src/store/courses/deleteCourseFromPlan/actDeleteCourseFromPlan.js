// src/store/deleteCourseFromPlan/actDeleteCourseFromPlan.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://edu-smart.runasp.net";

export const actDeleteCourseFromPlan = createAsyncThunk(
  "planCourse/delete",
  async ({ courseId, planId, token }, { rejectWithValue }) => {
    try {

      const response = await axios.delete(
        `${API_URL}/api/Admin/delete-course-from-plan/${courseId}/${planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Error Deleting Course:",
        error.response?.data?.errors || error.message
      );
      return rejectWithValue(
        error.response?.data?.errors || "Something went wrong"
      );
    }
  }
);
