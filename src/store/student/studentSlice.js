// src/redux/slices/studentSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../api/BASE_URL";
/* =====================================
 * ✅ Create Student
 * ===================================== */
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
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

/* =====================================
 * ✅ Create Disabled Student
 * ===================================== */
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
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
      return rejectWithValue(msg || "Error");
    } finally {
      toast.dismiss(loadingToast);
    }
  }
);

/* =====================================
 * ✅ Fetch Student Info (عام)
 * ===================================== */
export const fetchStudentInfo = createAsyncThunk(
  "student/fetchStudentInfo",
  async ({ studentId, token }, { rejectWithValue }) => {
    try {
      // debug log (اختياري)
      const res = await axios.get(
        `${BASE_URL}/api/Student/student-info/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error fetching student info";
      console.log(msg);
      return rejectWithValue(msg);
    }
  }
);

/* =====================================
 * ✅ Fetch Student Profile by ID (Cache per ID)
 *  - ترجع بروفايل الطالب + تحتفظ به في profilesById[studentId]
 * ===================================== */
export const fetchStudentProfile = createAsyncThunk(
  "student/fetchStudentProfile",
  async ({ studentId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/Student/student-profile/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );
      console.log("hamada"  ,res.data);
      return { studentId, data: res.data };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err.message ||
        "Error fetching student profile";
      return rejectWithValue({ studentId, message: msg });
    }
  }
);

/* =====================================
 * ✅ Slice
 * ===================================== */
const studentSlice = createSlice({
  name: "student",
  initialState: {
    loading: false,
    error: null,

    // آخر عملية create أو غيره
    student: null,

    // الحقل القديم اللى كنتِ بتستخدميه
    studentinfo: null,

    // ✅ كاش لكل بروفايل حسب الـ id
    profilesById: {},        // { [studentId]: profileObject }
    profileLoadingById: {},  // { [studentId]: boolean }
    profileErrorById: {},    // { [studentId]: string | undefined }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ---------- Create Student ---------- */
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

      /* ---------- Create Disabled Student ---------- */
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

      /* ---------- Fetch Student Info (عام) ---------- */
      .addCase(fetchStudentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.studentinfo = action.payload;
      })
      .addCase(fetchStudentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- Fetch Student Profile by ID (Per-ID cache) ---------- */
      .addCase(fetchStudentProfile.pending, (state, action) => {
        const id = action.meta.arg?.studentId;
        if (id != null) {
          state.profileLoadingById[id] = true;
          state.profileErrorById[id] = undefined;
        }
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        const { studentId, data } = action.payload || {};
        if (studentId != null) {
          state.profileLoadingById[studentId] = false;
          state.profilesById[studentId] = data;
        }
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        const id = action.payload?.studentId ?? action.meta.arg?.studentId;
        const msg = action.payload?.message || "Failed to fetch student profile";
        if (id != null) {
          state.profileLoadingById[id] = false;
          state.profileErrorById[id] = msg;
        }
      });
  },
});

export default studentSlice.reducer;

/* =====================================
 * ✅ Selectors جاهزة
 * ===================================== */
export const selectStudentProfileById = (state, studentId) =>
  state.student.profilesById?.[studentId] || null;

export const selectStudentProfileLoading = (state, studentId) =>
  !!state.student.profileLoadingById?.[studentId];

export const selectStudentProfileError = (state, studentId) =>
  state.student.profileErrorById?.[studentId] || null;