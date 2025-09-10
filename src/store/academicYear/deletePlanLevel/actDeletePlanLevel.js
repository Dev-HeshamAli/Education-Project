import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actDeletePlanLevel = createAsyncThunk(
  "DeletePlanLevel/delete",
  async ({ token, planId, studyLevelId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Admin/Delete-plan-level/${planId}/${studyLevelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to delete Plan Level";
      return rejectWithValue(message);
    }
  }
);
