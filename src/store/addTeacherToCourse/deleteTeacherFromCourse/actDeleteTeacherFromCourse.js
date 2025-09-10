// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

// ✅ Create School Class
export const actDeleteTeacherFromCourse = createAsyncThunk(
  "DeleteTeacherFromCourse/delete",
  async ({ token, teacherId, courseId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Admin/remove-teacher-from-course/${teacherId}/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to delete  Teacher From Course";
      return rejectWithValue(message);
    }
  }
);
