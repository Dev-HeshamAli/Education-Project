// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE_URL = "https://edu-smart.runasp.net";


// export const refreshAccessToken = createAsyncThunk(
//   "auth/refreshAccessToken",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(`${BASE_URL}/api/Auth/Refresh`, {}, {
//         withCredentials: true
//       });

//       return {
//         token: res.data.token,
//         expiresIn: res.data.expiresIn
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to refresh token");
//     }
//   }
// );
