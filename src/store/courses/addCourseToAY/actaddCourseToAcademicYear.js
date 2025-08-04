// src/store/deleteCourseFromAY/actDeleteCourseFromAcademicYear.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://edu-smart.runasp.net"; // عدّل حسب اسم API الحقيقي

export const actAddCourseToAcademicYear = createAsyncThunk(
  "academicYearCourse/delete",
  async ({ courseId, academicYearId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/Admin/add-course-to-academic-year/${courseId}/${academicYearId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error Deleting Course from AY:", error.response?.data?.errors || error.message);
      return rejectWithValue(error.response?.data?.errors || "Something went wrong");
    }
  }
);
