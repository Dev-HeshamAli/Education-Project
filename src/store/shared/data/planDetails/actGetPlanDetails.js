import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";

export const actGetPlanDetails = createAsyncThunk(
  "planDetails/fetchPlansDetails",
  async ({ token, planId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Admin/plan-details/${planId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.errors || "Something went wrong"
      );
    }
  }
);
