// src/store/course/actCreateCourse.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actCreateLink = createAsyncThunk(
  "Link/createLink",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Admin/Add-Lecture-Link`,
        data, // ده FormData نفسه مش Object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors ||
          error.response?.data?.title ||
          error.response?.data?.message ||
          "Something went wrong"
      );
    }
  }
);

