// src/store/academicYear/createAcademicYearAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";


export const actCreateAcademicYearSlice = createAsyncThunk(
  "academicYear/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      // Step 1: Check if the academic year exists
      const res = await axios.get(`${BASE_URL}/api/Shared/AcademicYears`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const existingYears = res.data;

      // Format the new year like "2025 - 2026"
      const newYear = `${data.startDate.slice(0, 4)} - ${data.endDate.slice(0, 4)}`;

      const alreadyExists = existingYears.some((year) => year.date === newYear);

      if (alreadyExists) {
        return rejectWithValue("This academic year already exists.");
      }

      // Step 2: Create new academic year
      const response = await axios.post(`${BASE_URL}/api/Admin/create-academic-year`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
