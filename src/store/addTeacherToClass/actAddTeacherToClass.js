// src/store/deleteCourseFromAY/actDeleteCourseFromAcademicYear.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://edu-smart.runasp.net"; 


export const actAddTeacherToClass = createAsyncThunk(
  "actAddTeacherToClass/add",
  async ({ teacherId, classId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/Admin/teacher-to-class/${teacherId}/${classId}`,
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
        return rejectWithValue("This teacher is already assigned to this class");
      }
      return rejectWithValue(error.response?.data || "Unknown error occurred");
    }
  }
);
