import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../api/BASE_URL";

// ✅ Create Student
export const createStudent = createAsyncThunk(
  "student/createStudent",
  async ({ formData, token }, { rejectWithValue }) => {
    
    try {
      const res = await axios.post(
        `${BASE_URL}/api/Parent/Create-student`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

    
      return res.data;
    } catch (err) {
      
      //toast.error(err.response?.data?.message || "Something went wrong");
      return rejectWithValue(err.response?.data?.message || "Error");
    } 
  }
);


export const createDisStudent = createAsyncThunk(
  "student/createDisStudent",
  async ({ formData, token }, { rejectWithValue }) => {
    const loadingToast = toast.loading("Creating student...");
    try {
      const res = await axios.post(
        `${BASE_URL}/api/Parent/Create-student-for-disabled`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Student created successfully!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      return rejectWithValue(err.response?.data?.message || "Error");
    } finally {
      toast.dismiss(loadingToast);
    }
  }
);
//  Fetch Student Info
export const fetchStudentInfo = createAsyncThunk(
  'student/fetchStudentInfo',
  async ({ studentId, token }, { rejectWithValue }) => {
    try {
      console.log("maraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaam" ,studentId )
      const res = await axios.get(
        `${BASE_URL}/api/Student/student-info/${studentId}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Error fetching student info");
    }
  }
);

// ✅ Slice
const studentSlice = createSlice({
  name: "student",
  initialState: {
    loading: false,
    error: null,
    student: null,
    studentinfo: null, // ✅ lowercase variable as you requested
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // create dis child
      .addCase(createDisStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDisStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(createDisStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch Student Info
      .addCase(fetchStudentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.studentinfo = action.payload; // ✅ updated here
      })
      .addCase(fetchStudentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentSlice.reducer;
