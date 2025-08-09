import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import adminReducer from "./admin/createAdmin/createAdminSlice";
import adminInfoReducer from "./admin/getAdminInfo/getAdminInfoSlice";
import updateAdminReducer from "./admin/updateAdmin/updateAdminSlice";
import deleteAdminReducer from "./admin/deleteAdmin/deleteAdminSlice";
import createAcademicYearReducer from "./academicYear/createAcademicYear/createAcademicYearSlice";
import createPlanReducer from "./academicYear/plan/planSlice";
import createStageReducer from "./academicYear/stage/stageSlice";
import studyLevelReducer from "./academicYear/studyLevel/studyLevelSlice";
import createPlanLevelReducer from "./academicYear/createPlanLevel/createPlanLevelSlice";
import studyLevelIdReducer from "./shared/studyLevel/studyLevelsSlice";
import planIdlReducer from "./shared/plan/planSlice";
import updatePlanLevelReducer from "./academicYear/updatePlanLevel/updatePlanLevelSlice";
import stageIdReducer from "./shared/stage/stageSlice";
import semestersIdReducer from "./shared/semesters/semestersSlice";
import academicYearsIdReducer from "./shared/academicYears/academicYearsSlice";
import courseStudyLevelIdReducer from "./shared/coursesStudyLevel/coursesStudyLevelSlice";
import courseReducer from "./courses/createCourseSlice";
import addCourseToPlanReducer from "./courses/addCourseToPlan/addCourseToPlanSlice";
import deleteCourseFromPlanReducer from "./courses/deleteCourseFromPlan/deleteCourseFromPlanSlice";
import addCourseToAcademicYearReducer from "./courses/addCourseToAY/addCourseToAcademicYearSlice";
import deleteCourseReducer from "./courses/deleteCourse/deleteCourseSlice";
import updateCourseReducer from "./courses/updateCourse/updateCourseSlice";
import createSchoolClassReducer from "./schoolClass/schoolClassSlice";
import createSchoolClassIdReducer from "./shared/schoolClass/schoolClassIdSlice";
import updateSchoolClassReducer from "./schoolClass/updateSchoolClass/updateSchoolClassSlice";
import deleteSchoolClassReducer from "./schoolClass/deleteSchoolClass/deleteSchoolClassSlice";
import StudentIdByClassReducer from "./shared/studentIdByClass/studentIdByClassSlice";
import createTeacherReducer from "./createTeacher/createTeacherSlice";
import teacherByNameReducer from "./shared/teacherByName/teacherBynameSlice";
import deleteTeacherReducer from "./deleteTeacher/deleteTeacherSlice";
import addTeacherToStudyLevelReducer from "./addTeacherToStudyLevel/addTeacherToStudyLevelSlice";
import teacherByStudyLevelReducer from "./shared/teacherByStudyLevel/teacherByStudyLevelSlice";
import addTeacherToCourseReducer from "./addTeacherToCourse/addTeacherToCourseSlice";
import addTeacherToClassReducer from "./addTeacherToClass/addTeacherToClassSlice";
import createScheduleReducer from "./schedule/createScheduleSlice";


export const store = configureStore({
  reducer: {
    //--------------Auth Reducers----------------//
    auth: authReducer,
    //--------------Admin Reducers----------------//
    admin: adminReducer,
    adminInfo: adminInfoReducer,
    updateAdmin: updateAdminReducer,
    deleteAdmin: deleteAdminReducer,
    //--------------Academic Year Reducers----------------//
    academicYear: createAcademicYearReducer,
    plan: createPlanReducer,
    stage: createStageReducer,
    studyLevel: studyLevelReducer,
    planLevel: createPlanLevelReducer,
    updatePlanLevel: updatePlanLevelReducer,
    //--------------Shared Reducers----------------//
    studyLevelsId: studyLevelIdReducer,
    plansId: planIdlReducer,
    stageId: stageIdReducer,
    academicYearsId: academicYearsIdReducer,
    semestersId: semestersIdReducer,
    coursesStudyLevelsId: courseStudyLevelIdReducer,
    schoolClassId: createSchoolClassIdReducer,
    studentIdByClass: StudentIdByClassReducer,
    teacherByName: teacherByNameReducer,
    teacherByStudyLevel: teacherByStudyLevelReducer,
    //--------------Courses Study Level Reducers----------------//
    createCourse: courseReducer,
    addCourseToPlan: addCourseToPlanReducer,
    deleteCourseFromPlan: deleteCourseFromPlanReducer,
    addCourseToAcademicYear: addCourseToAcademicYearReducer,
    deleteCourse: deleteCourseReducer,
    updateCourse: updateCourseReducer,
    //--------------School Class Reducers----------------//
    createSchoolClass:createSchoolClassReducer,
    updateSchoolClass: updateSchoolClassReducer,
    deleteSchoolClass: deleteSchoolClassReducer,
    //--------------Create Teacher Reducers----------------//
    createTeacher: createTeacherReducer,
    deleteTeacher: deleteTeacherReducer,
    addTeacherToStudyLevel: addTeacherToStudyLevelReducer,
    addTeacherToCourse: addTeacherToCourseReducer, 
    addTeacherToClass: addTeacherToClassReducer,
    // --------------Schedule Reducers----------------//
    createSchedule: createScheduleReducer,
  },
});
