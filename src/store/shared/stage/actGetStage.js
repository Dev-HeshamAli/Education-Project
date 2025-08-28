import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";


export const fetchStages = createAsyncThunk(
  "stage/fetchStages",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Shared/Stages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.errors || "Something went wrong");
    }
  }
);