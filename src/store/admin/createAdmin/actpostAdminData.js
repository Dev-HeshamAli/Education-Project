// src/redux/adminThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const createAdmin = createAsyncThunk(
  "admin/createAdmin",
  async ({ adminData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Admin/create-Admin`,
        adminData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const backendErrors = error.response?.data?.errors;

      const message =
        Array.isArray(backendErrors) &&
        backendErrors.includes("Email must unique")
          ? "This Email Already Exists"
          : error.response?.data?.title || "Something went wrong!";

      return rejectWithValue(message);
    }
  }
);
