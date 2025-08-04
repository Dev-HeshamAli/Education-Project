// src/store/plan/createPlanAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://edu-smart.runasp.net";

export const actCreatePlan = createAsyncThunk(
  "plan/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      // Step 1: Check if the plan already exists
      const res = await axios.get(`${BASE_URL}/api/Shared/Plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const existingPlans = res.data;

      const planAlreadyExists = existingPlans.some(
        (plan) => plan.name.trim().toLowerCase() === data.name.trim().toLowerCase()
      );

      if (planAlreadyExists) {
        return rejectWithValue("This plan already exists.");
      }

      // Step 2: Create the new plan
      const response = await axios.post(`${BASE_URL}/api/Admin/create-plan`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      const errorsArray = err.response?.data?.errors;

      const message =
        Array.isArray(errorsArray) && errorsArray.length > 0
          ? errorsArray[errorsArray.length - 1]
          : err.response?.data?.title || "Something went wrong";

      return rejectWithValue(message);
    }
  }
);
