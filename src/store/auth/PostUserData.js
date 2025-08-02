
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://edu-smart.runasp.net";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/Auth/Login`, userData);
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      return res.data;
    } catch (error) {
      const backendErrors = error.response?.data?.errors;

      const message =
        Array.isArray(backendErrors) &&
        backendErrors.some((err) =>
          err.includes("No user was found with the provided ID")
        )
          ? "Email or Password is incorrect"
          : error.response?.data?.title || "Something went wrong!";

      return rejectWithValue(message);
    }
  }
);
