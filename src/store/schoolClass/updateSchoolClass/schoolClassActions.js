// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const updateSchoolClass = createAsyncThunk(
  "schoolClass/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/Admin/update-school-class`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      let message = "An error occurred";
      if (error.response && error.response.data) {
        message = error.response.data.errors || JSON.stringify(error.response.data);
      }
      return rejectWithValue(message);
    }
  }
);
