// src/store/schoolClass/schoolClassActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actDeleteLecLink = createAsyncThunk(
  "DeleteLecLink/delete",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Admin/Delete-Lecture-Link/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to delete Link";
      return rejectWithValue(message);
    }
  }
);
