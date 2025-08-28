// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actActiveTeacher = createAsyncThunk(
  "ActiveTeacher/active",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/Admin/Active-Teacher/${id}`,
        {}, // body فاضي
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to Active Teacher";
      return rejectWithValue(message);
    }
  }
);
