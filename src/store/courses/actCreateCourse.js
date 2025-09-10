// src/store/course/actCreateCourse.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../api/BASE_URL";

export const actCreateCourse = createAsyncThunk(
  "course/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/Admin/create-course`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(" Error Creating Course:", error.response?.data?.errors || error.message);
      return rejectWithValue(error.response?.data?.errors || "Something went wrong");
    }
  }
);
