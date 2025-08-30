
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../api/BASE_URL";

export const actRefreshAuth = createAsyncThunk(
  "reafreshAuth/actRefreshAuth",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/Auth/Get-RefreshToken`, userData);
    //   console.log(res.data);
      return res.data;
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      return rejectWithValue(backendErrors);
    }
  }
);
