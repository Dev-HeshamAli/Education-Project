// src/store/courses/actUpdateCourse.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actUpdateCourse = createAsyncThunk(
  "course/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {

      const response = await axios.put(`${BASE_URL}/api/Admin/update-course`, data, {
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
