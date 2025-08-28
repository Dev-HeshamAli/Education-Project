import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://edu-smart.runasp.net";

export const actDeletePlanLevel = createAsyncThunk(
  "DeletePlanLevel/delete",
  async ({ token, planId, studyLevelId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/Admin/Delete-plan-level/${planId}/${studyLevelId}`,
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
