// // src/store/admin/updateAdmin/fetchAdminById.js
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE_URL = "https://edu-smart.runasp.net";

// export const fetchAdminById = createAsyncThunk(
//   "admin/fetchById",
//   async (id, thunkAPI) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         `${BASE_URL}/api/Admin/Admin-info/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       localStorage.setItem("adminInfo", JSON.stringify(response.data));

//       return response.data;
//     } catch (error) {
//       const message =
//         error.response?.data?.errors || "Failed to fetch admin data";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// src/store/admin/updateAdmin/fetchAdminById.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://edu-smart.runasp.net";

export const fetchAdminById = createAsyncThunk(
  "admin/fetchById",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Admin/Admin-info/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // localStorage.setItem("adminInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errors || "Failed to fetch admin data";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
