import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from "../../api/BASE_URL";

// ⬇️ اختياري: لو عندك توكن مطلوب لنقاط معينة
// const authHeaders = (token) => token ? { Authorization: `Bearer ${token}` } : {};

export const fetchParentInfo = createAsyncThunk(
  'parent/fetchParentInfo',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/Parent/Parent-info`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Error');
    }
  }
);

export const getJobDiscounts = createAsyncThunk(
  'parent/getJobDiscounts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/Shared/Job-Discounts`);
      // ممكن تكون array of strings أو array of objects
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Error');
    }
  }
);

const parentSlice = createSlice({
  name: 'parent',
  initialState: {
    parentInfo: null,
    requestDetails: null,
    requestStudentID: null,

    profileJobDiscounts: [],

    // ⬇️ جديد: حالة خصومات/وظايف
    jobDiscounts: [],
    jobDiscountsLoading: false,
    jobDiscountsError: null,

    loading: false,
    error: null
  },
  reducers: {
    setRequestDetails(state, action) {
      state.requestDetails = action.payload;
    },
    setRequestStudentID(state, action) {
      state.requestStudentID = action.payload;
    },
    clearParentError(state) {
      state.error = null;
    },
    clearJobDiscountsError(state) {
      state.jobDiscountsError = null;
    },

    setProfileJobDiscounts: (state, action) => {
      state.profileJobDiscounts = Array.isArray(action.payload) ? action.payload : [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchParentInfo
      .addCase(fetchParentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.parentInfo = action.payload;
      })
      .addCase(fetchParentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⬇️ جديد: getJobDiscounts
      .addCase(getJobDiscounts.pending, (state) => {
        state.jobDiscountsLoading = true;
        state.jobDiscountsError = null;
      })
      .addCase(getJobDiscounts.fulfilled, (state, action) => {
        state.jobDiscountsLoading = false;
        state.jobDiscounts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getJobDiscounts.rejected, (state, action) => {
        state.jobDiscountsLoading = false;
        state.jobDiscountsError = action.payload;
      });
  }
});

export const {
  setRequestDetails,
  setRequestStudentID,
  setProfileJobDiscounts,
  clearParentError,
  clearJobDiscountsError
} = parentSlice.actions;

export default parentSlice.reducer;
