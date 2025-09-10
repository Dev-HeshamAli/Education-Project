import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../api/BASE_URL";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/Auth/Login`, userData);
      
      return res.data;
    } catch (error) {
      const backendErrors = error.response?.data?.errors;

      return rejectWithValue(backendErrors);
    }
  }
);
