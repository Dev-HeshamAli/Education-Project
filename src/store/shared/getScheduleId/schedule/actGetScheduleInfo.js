import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../../api/BASE_URL";

export const actGetScheduleInfo = createAsyncThunk(
  "schedule/fetchSchedule",
  async (
    { token, studyLevelId, semesterId, ScheduleTimeId  },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Student/class-schedule/${studyLevelId}/${semesterId}/${ScheduleTimeId}`,
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
