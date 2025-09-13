// 📁 store/shared/sharedDataSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../api/BASE_URL";

// ✅ Get Stages
export const getStages = createAsyncThunk(
  "shared/getStages",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Shared/Stages`);
      return response.data;
    } catch (err) {
      toast.error("Error fetching stages");
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch stages");
    }
  }
);

// ✅ Get Study Levels
export const getStudyLevels = createAsyncThunk(
  "shared/getStudyLevels",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Shared/StudyLevels`);
      return response.data;
    } catch (err) {
      toast.error("Error fetching study levels");
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch levels");
    }
  } 
);

//  Get Semesters
export const getSemesters = createAsyncThunk(
  "shared/getSemesters",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Shared/Semesters`);
      return response.data;
    } catch (err) {
      toast.error("Error fetching semester");
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch semesters");
    }
  } 
);

//  Get Plans
export const getPlans = createAsyncThunk(
  "shared/getPlans",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Shared/Plans`);
      return response.data;
    } catch (err) {
      toast.error("Error fetching plans");
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch plans");
    }
  } 
);

/* ================== New ================== */
// ✅ Get Countries (REST Countries)
export const getContries = createAsyncThunk( // intentionally matching your requested name
  "shared/getContries",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      // Normalize: [{name, code}] sorted A-Z
      const countries = res.data
        .map(c => ({ name: c?.name?.common, code: c?.cca2 || c?.cca3 }))
        .filter(c => c.name)
        .sort((a, b) => a.name.localeCompare(b.name));
      return countries;
    } catch (err) {
      toast.error("Error fetching countries");
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch countries");
    }
  }
);

// ✅ Get Egypt Governorates (CountriesNow)
export const getGovernrate = createAsyncThunk( // intentionally matching your requested name
  "shared/getGovernrate",
  async (_, thunkAPI) => {
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: "Egypt" }
      );
      // Normalize: ["Cairo", "Giza", ...] sorted A-Z
      const states = res.data?.data?.states?.map(s => s.name)?.sort((a, b) => a.localeCompare(b)) || [];
      return states;
    } catch (err) {
      toast.error("Error fetching governorates");
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch governorates");
    }
  }
);

// ✅ Initial State
const initialState = {
  stages: [],
  studyLevels: [],
  semesters: [],
  plans:[],
  countries: [],
  governorates: [],
  loading: false,
  error: null
};

// ✅ Slice
const sharedDataSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Stages
      .addCase(getStages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStages.fulfilled, (state, action) => {
        state.loading = false;
        state.stages = action.payload;
      })
      .addCase(getStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Study Levels
      .addCase(getStudyLevels.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudyLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.studyLevels = action.payload;
      })
      .addCase(getStudyLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

        // Semesters
      .addCase(getSemesters.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSemesters.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = action.payload;
      })
      .addCase(getSemesters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Plans
      .addCase(getPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Countries
      .addCase(getContries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload; // [{name, code}]
      })
      .addCase(getContries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Governorates
      .addCase(getGovernrate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGovernrate.fulfilled, (state, action) => {
        state.loading = false;
        state.governorates = action.payload; // ["Cairo", "Giza", ...]
      })
      .addCase(getGovernrate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default sharedDataSlice.reducer;
