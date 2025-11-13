import { createSlice } from "@reduxjs/toolkit";

const selectinIdsSlice = createSlice({
  name: "selectionIds",
  initialState: {
    courseId: null,
    teacherId: null,
    studyLevelId: null,
    classId: null,
    semesterId: null,
    planId: null,
    academicYearId: null,
    studentId: null,
    stageId: null,
    scheduleId: null,
    activeAccordion: null,   // 👈 الجديد
    activeItem: null,  
    scheduleTime: null,      // 👈 الجديد
    scheduleTime2: null,      // 👈 الجديد
  },
  reducers: {
    setTeacherId: (state, action) => {
      state.teacherId = action.payload;
    },
    setScheduleTime: (state, action) => {
      state.scheduleTime = action.payload;
    },
    setScheduleTime2: (state, action) => {
      state.scheduleTime2 = action.payload;
    },
    setStudyLevelId: (state, action) => {
      state.studyLevelId = action.payload;
    },
    setCourseId: (state, action) => {
      state.courseId = action.payload;
    },
    setClassId: (state, action) => {
      state.classId = action.payload;
    },
    setPlanId: (state, action) => {
      state.planId = action.payload;
    },
    setScheduleId: (state, action) => {
      state.scheduleId = action.payload;
    },
    setStageId: (state, action) => {
      state.stageId = action.payload;
    },
    setStudentId: (state, action) => {
      state.studentId = action.payload;
    },
    setAcademicYearId: (state, action) => {
      state.academicYearId = action.payload;
    },
    setSemesterId: (state, action) => {
      state.semesterId = action.payload;
    },
        setActiveAccordion: (state, action) => {
      state.activeAccordion = action.payload;
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
    clearAll: (state) => {
      state.teacherId = null;
      state.studyLevelId = null;
      state.classId = null;
      state.courseId = null;
      state.planId = null;
      state.scheduleId = null;
      state.stageId = null;
      state.studentId = null;
      state.academicYearId = null;
      state.semesterId = null;
      state.activeAccordion = null;
      state.activeItem = null;
      state.scheduleTime = null;
      state.scheduleTime2 = null;
    },
  },
});

export const {
  setTeacherId,
  setStudyLevelId,
  setCourseId,
  clearAll,
  setClassId,
  setPlanId,
  setScheduleId,
  setStageId,
  setStudentId,
  setAcademicYearId,
  setSemesterId,
    setActiveAccordion,
  setActiveItem,
  setScheduleTime,
  setScheduleTime2
} = selectinIdsSlice.actions;
export default selectinIdsSlice.reducer;
