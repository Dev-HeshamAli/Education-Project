import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";


export const actGetAdmin = createAsyncThunk(
  "admin/fetchAdmin",
  async ({token,id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Admin/Admin-info/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.errors || "Something went wrong");
    }
  }
);