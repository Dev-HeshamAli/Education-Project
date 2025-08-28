// src/store/deleteCourseFromPlan/actDeleteCourseFromPlan.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actDeleteCourseFromPlan = createAsyncThunk(
  "planCourse/delete",
  async ({ courseId, planId, token }, { rejectWithValue }) => {
    try {

      const response = await axios.delete(
        `${BASE_URL}/api/Admin/delete-course-from-plan/${courseId}/${planId}`,
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
