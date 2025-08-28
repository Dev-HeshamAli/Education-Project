import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";


export const fetchProblems = createAsyncThunk(
  "problems/fetchProblems",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Admin/Get-UnSolved-UserProblem`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.title || "Something went wrong");
    }
  }
);