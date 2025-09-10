import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../api/BASE_URL";


export const fetchSolvedProblems = createAsyncThunk(
  "solvedProblems/fetchSolvedProblems",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Admin/Get-Solved-UserProblem`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.title || "Something went wrong");
    }
  }
);