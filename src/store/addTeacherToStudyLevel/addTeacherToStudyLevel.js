// src/store/deleteCourseFromAY/actDeleteCourseFromAcademicYear.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../api/BASE_URL";


export const addTeacherToStudyLevel = createAsyncThunk(
  "addTeacherToStudyLevel/add",
  async ({ teacherId, studyLevelId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Admin/add-teacher-to-study-level/${teacherId}/${studyLevelId}`,
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
        return rejectWithValue("This teacher is already assigned to this study level");
      }
      return rejectWithValue(error.response?.data || "Unknown error occurred");
    }
  }
);
