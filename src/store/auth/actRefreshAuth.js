import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../api/BASE_URL";

export const actRefreshAuth = createAsyncThunk(
  "refreshAuth/actRefreshAuth", // تصحيح الاسم
  async ({ token, refrehToken }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/Auth/Get-RefreshToken`, {
        token: token,
        refrehToken: refrehToken,
      });
      // console.log("Refresh response:", res.data);
      return res.data;
    } catch (error) {
      console.error(
        "Refresh token error:",
        error.response?.data || error.message
      );
      const backendErrors =
        error.response?.data?.errors || error.response?.data || error.message;
      return rejectWithValue(backendErrors);
    }
  }
);
