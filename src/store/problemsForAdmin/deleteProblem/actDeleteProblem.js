// store/admin/deleteAdmin/actDeleteAdmin.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../../api/BASE_URL";

export const actDeleteProblem = createAsyncThunk(
  "problem/deleteProblem",
  async ({ token, id}, { rejectWithValue }) => {
    try {

      const res = await axios.delete(
        ` ${BASE_URL}/api/Admin/Delete-UserProblem/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);
