import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../../api/BASE_URL";

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
