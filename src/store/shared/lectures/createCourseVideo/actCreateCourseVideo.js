// ✅ actCreatePlanLevel.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../../api/BASE_URL";

export const actCreateCourseVideo = createAsyncThunk(
  "video/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Course/add-cartoon-video`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorsArray = err.response?.data?.errors;
      const message =
        Array.isArray(errorsArray) && errorsArray.length > 0
          ? errorsArray[errorsArray.length - 1]
          : err.response?.data?.title || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);
