import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  studentID: null,
  PlanID: null,
  CourseID: null,

  // ✅ سياق مشاهدة الدرس بدل p/k/v في الـ URL
  lectureContext: {
    courseDetailId: null,
    courseId: null,
    lecNo: null,
    kind: "auto",   // "auto" | "lecture" | "cartoon"
    version: 1,     // للسويتشات البسيطة (v=1)
  },

  // ✅ لاستخدامه في صفحات: summarize/chat/translate/quiz
  activeCourseDetailId: null,
};

const dataIDsSlice = createSlice({
  name: 'dataIDs',
  initialState,
  reducers: {
    setStudentID(state, action) {
      state.studentID = action.payload ?? null;
    },
    setPlanID(state, action) {
      state.PlanID = action.payload ?? null;
    },
    setCourseID(state, action) {
      state.CourseID = action.payload ?? null;
    },

    // ✅ نمرّر كل البرامترات دفعة واحدة
    setLectureContext(state, action) {
      const { courseDetailId, courseId, lecNo, kind = "auto", version = 1 } = action.payload || {};
      state.lectureContext = {
        courseDetailId: courseDetailId ?? null,
        courseId: courseId ?? null,
        lecNo: lecNo ?? null,
        kind,
        version,
      };
    },

    setActiveCourseDetailId(state, action) {
      state.activeCourseDetailId = action.payload ?? null;
    },

    resetIDs() {
      return initialState;
    },
  },
});

export const {
  setStudentID,
  setPlanID,
  setCourseID,
  setLectureContext,
  setActiveCourseDetailId,
  resetIDs
} = dataIDsSlice.actions;

export const selectStudentID           = (s) => s.dataIDs.studentID;
export const selectPlanID              = (s) => s.dataIDs.PlanID;
export const selectCourseID            = (s) => s.dataIDs.CourseID;
export const selectLectureContext      = (s) => s.dataIDs.lectureContext;
export const selectActiveCourseDetailId= (s) => s.dataIDs.activeCourseDetailId;

export default dataIDsSlice.reducer;
