// src/store/shared/deleteCourse/actDeleteCourse.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";
export const actDeleteCourse = createAsyncThunk(
  "deleteCourse/delete",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/Admin/delete-course/${id}`, {
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
