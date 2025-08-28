import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://edu-smart.runasp.net";

// export const actGetLectureVideo = createAsyncThunk(
//   "lecturesVideo/fetchlecturesVideo",
//   async ({ token, courseId, lecId }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/Course/cartoon-video-stream/${courseId}/${lecId}`,
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//           },
//           responseType: 'blob', // مهم جداً: تحديد نوع الاستجابة كـ blob
//         }
//       );
      
//       // إرجاع الـ blob مباشرة
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.errors || 
//         err.response?.data?.message || 
//         "Something went wrong"
//       );
//     }
//   }
// );

export const actGetLectureVideo = createAsyncThunk(
  "lecturesVideo/fetchlecturesVideo",
  async ({ token, courseId, lecId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Course/cartoon-video-stream/${courseId}/${lecId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const blob = response.data;

      // ✅ رجّع URL string مش Blob
      const videoUrl = URL.createObjectURL(blob);

      return videoUrl;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.errors ||
          err.response?.data?.message ||
          "Something went wrong"
      );
    }
  }
);
