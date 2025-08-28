import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../api/BASE_URL";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/Auth/Login`, userData);
      const token = res.data.token;
      // const data = res.data;
      // console.log(data);

      localStorage.setItem("token", token);
      localStorage.setItem("id", JSON.stringify(res.data.id));
      localStorage.setItem("role", JSON.stringify(res.data.roles));

      return res.data;
    } catch (error) {
      const backendErrors = error.response?.data?.errors;

      const message =
        Array.isArray(backendErrors) &&
        backendErrors.some((err) =>
          err.includes("No user was found with the provided ID")
        )
          ? "Email or Password is incorrect"
          : error.response?.data?.errors || "Something went wrong!";

      return rejectWithValue(message);
    }
  }
);
