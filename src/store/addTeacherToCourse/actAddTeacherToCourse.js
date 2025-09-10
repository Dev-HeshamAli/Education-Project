// src/store/deleteCourseFromAY/actDeleteCourseFromAcademicYear.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../api/BASE_URL";


export const actAddTeacherToCourse = createAsyncThunk(
  "actAddTeacherToCourse/add",
  async ({ teacherId, courseId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Admin/add-teacher-to-Course/${teacherId}/${courseId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 500) {
        return rejectWithValue("This teacher is already assigned to this Course");
      }
      return rejectWithValue(error.response?.data.errors || "Unknown error occurred");
    }
  }
);
