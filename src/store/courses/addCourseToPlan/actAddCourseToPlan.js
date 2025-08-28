// src/store/addCourseToPlan/actAddCourseToPlan.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actAddCourseToPlan = createAsyncThunk(
  "planCourse/add",
  async ({ courseId, planId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(` ${BASE_URL}/api/Admin/add-course-to-plan/${courseId}/${planId}`,null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.errors || "Something went wrong");
    }
  }
);
