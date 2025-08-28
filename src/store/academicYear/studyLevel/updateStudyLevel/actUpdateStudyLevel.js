// ✅ actCreatePlanLevel.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../../api/BASE_URL";

export const actUpdateStudyLevel = createAsyncThunk(
  "updateStudyLevel/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/Admin/update-study-level`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorsArray = err.response?.data?.errors;
      const message =
        Array.isArray(errorsArray) && errorsArray.length > 0
          ? errorsArray[errorsArray.length - 1]
          : err.response?.data?.errors || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);