import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";


export const actGetScheduleId = createAsyncThunk(
  "schedule/fetchSchedule",
  async ({token, id, date}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Student/class-schedule/${id}?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.errors || "Something went wrong");
    }
  }
);