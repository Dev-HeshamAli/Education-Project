import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../api/BASE_URL";


export const fetchPlans = createAsyncThunk(
  "plan/fetchPlans",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Shared/Plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.errors || "Something went wrong");
    }
  }
);