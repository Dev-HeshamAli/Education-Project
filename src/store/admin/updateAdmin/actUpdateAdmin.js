// // adminActions.js
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE_URL = "https://edu-smart.runasp.net";


// export const updateAdmin = createAsyncThunk(
//   "admin/updateAdmin",
//   async (data, thunkAPI) => {
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/api/Admin/update-Admin`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue("Failed to update admin data");
//     }
//   }
// );


// adminActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://edu-smart.runasp.net";

// ✅ Update Admin API Call
export const actUpdateAdmin = createAsyncThunk(
  "admin/actUpdateAdmin",
  async (adminData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/Admin/update-Admin`,
        adminData, // لازم يحتوي على { id, firstName, secondName, ... }
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update admin data";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
