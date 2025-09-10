import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../../api/BASE_URL";


export const fetchSchoolClassId = createAsyncThunk(
  "schoolClass/fetchSchoolClassId",
  async ({token, id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Shared/Classes-StudyLevel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.title || "Something went wrong");
    }
  }
);