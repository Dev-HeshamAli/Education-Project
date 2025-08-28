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
import coursesInStudyLevelIdReducer from "./shared/coursesInStudyLevel/coursesInStudyLevelSlice";
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
import removeTeacherFromCourseReducer from "./addTeacherToCourse/deleteTeacherFromCourse/deleteTeacherFromCourseSlice";
import createScheduleReducer from "./schedule/createScheduleSlice";
import updateScheduleReducer from "./schedule/updateSchedule/updateScheduleSlice";
import deleteScheduleReducer from "./schedule/deleteSchedule/deleteScheduleSlice";
import createDiscountCodeReducer from "./createDiscountCode/createDiscountCode";
import createJobDiscountReducer from "./createJobDiscount/createJobDiscount";
import getJobDiscountReducer from "./shared/jobDiscount/jobDiscountSlice";
import updateJobDiscountReducer from "./createJobDiscount/updateJobDiscount/updateJobDiscountSlice";
import deleteJobDiscountReducer from "./createJobDiscount/deleteJobDiscount/deleteJobDiscountSlice";
import getDiscountCodeReducer from "./shared/discountCode/discountCodeSlice";
import updateDiscountCodeReducer from "./createDiscountCode/updateDiscountCode/updateDiscountCodeSlice";
import deleteStudyLevelReducer from "./academicYear/studyLevel/deleteStudyLevel/deleteStudyLevelSlice";
import deleteDiscountCodeReducer from "./createDiscountCode/deleteDiscountCode/deleteDiscountCodeSlice";
import getProblemsReducer from "./shared/problems/problemsSlice";
import courseStudyLevelIdReducer from "./shared/coursesStudyLevel/coursesStudyLevelSlice";
import getSolvedProblemsReducer from "./shared/solvedProblems/solvedProblemsSlice";
import deleteProblemReducer from "./problemsForAdmin/deleteProblem/deleteProblemSlice";
import solveProblemReducer from "./problemsForAdmin/solveProblem/solveProblemSlice";
import scheduleIdIdReducer from "./shared/getScheduleId/getScheduleIdSlice";
import scheduleInfoIdReducer from "./shared/getScheduleId/schedule/getScheduleInfoSlice";
import deletePlanReducer from "./academicYear/plan/deleteplan/deletePlanSlice";
import updatePlanReducer from "./academicYear/plan/updatePlan/updatePlanSlice";
import deleteStageReducer from "./academicYear/stage/deleteStage/deleteStageSlice";
import planDetailsReducer from "./shared/data/planDetails/planDetailsSlice";
import courseDetailsReducer from "./shared/courseDetails/courseDetailsSlice";
import allCoursesTableDetailsReducer from "./shared/data/allCoursesTable/allCoursesTableSlice";
import levelsInPlanReducer from "./shared/data/getLevelsInPlan/levelsInPlanSlice";
import updateStudyLevelReducer from "./academicYear/studyLevel/updateStudyLevel/updateStudyLevelSlice";
import addLecToScheduleReducer from "./schedule/addLecToSchedule/addLecToScheduleSlice";
import deletePlanLevelReducer from "./academicYear/deletePlanLevel/deletePlanLevelSlice";
import deleteAcademicYearReducer from "./academicYear/createAcademicYear/deleteAY/deleteAYSlice";
import updateLecToScheduleReducer from "./schedule/updateLecToSchedule/updateLecToScheduleSlice";
import selectionIdsReducer from "./LOCAL_DATA/selectinIdsSlice";
import lecturesReducer from "./shared/lectures/lecturesSlice";
import createScheduleDayReducer from "./schedule/createScheduleDay/createScheduleDaySlice";
import updateScheduleDayReducer from "./schedule/updateScheduleDay/updateScheduleDaySlice";
import deleteScheduleDayReducer from "./schedule/deleteScheduleDay/deleteScheduleDaySlice";
import deleteLectureReducer from "./shared/lectures/deleteCourseVideo/deleteCourseVideoSlice";
import createLectureReducer from "./shared/lectures/createCourseVideo/createCourseVideoSlice";
import updateLectureReducer from "./shared/lectures/updateCourseVideo/updateCourseVideoSlice";
import lecturesVideoReducer from "./shared/lectures/lectureVideo/lecturesVideoSlice";
import allLevelsReducer from "./shared/data/allLevelsAndSemester/allLevelsSlice";
import anyCourseNameReducer from "./shared/anyCourseName/anyCourseNameSlice";
import activeYearReducer from "./shared/academicYears/ActiveAcademicYear/activeAcademicYearSlice";
import deleteLecFromScheduleReducer from "./schedule/deleteLecFromSchedule/deleteLecFromScheduleSlice";
import schoolClassDetailsReducer from "./shared/schoolClass/getSchoolClassDetails/getSchoolClassDetailsSlice";

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
    deleteAcademicYear: deleteAcademicYearReducer,
    plan: createPlanReducer,
    updatePlan: updatePlanReducer,
    deletePlan: deletePlanReducer,
    stage: createStageReducer,
    deleteStage: deleteStageReducer,
    studyLevel: studyLevelReducer,
    updateStudyLevel: updateStudyLevelReducer,
    planLevel: createPlanLevelReducer,
    updatePlanLevel: updatePlanLevelReducer,
    deleteStudyLevel: deleteStudyLevelReducer,
    deletePlanLevel: deletePlanLevelReducer,
    //--------------Shared Reducers----------------//
    studyLevelsId: studyLevelIdReducer,
    plansId: planIdlReducer,
    stageId: stageIdReducer,
    academicYearsId: academicYearsIdReducer,
    semestersId: semestersIdReducer,
    coursesStudyLevelsId: courseStudyLevelIdReducer,
    coursesInStudyLevels: coursesInStudyLevelIdReducer,
    schoolClassId: createSchoolClassIdReducer,
    schoolClassesDetails: schoolClassDetailsReducer,
    studentIdByClass: StudentIdByClassReducer,
    teacherByName: teacherByNameReducer,
    teacherByStudyLevel: teacherByStudyLevelReducer,
    jobDiscount: getJobDiscountReducer,
    discountCode: getDiscountCodeReducer,
    problems: getProblemsReducer,
    solvedProblems: getSolvedProblemsReducer,
    getScheduleId: scheduleIdIdReducer,
    getScheduleInfo: scheduleInfoIdReducer,
    planDetails: planDetailsReducer,
    allLevels: allLevelsReducer,
    // coursesInStudyLevel: coursesInStudyLevelReducer,
    levelsInPlan: levelsInPlanReducer,
    courseDetails: courseDetailsReducer,
    allCoursesTableDetails: allCoursesTableDetailsReducer,
    activeYear: activeYearReducer,
    anyCourseName: anyCourseNameReducer,
    //--------------Courses Study Level Reducers----------------//
    createCourse: courseReducer,
    addCourseToPlan: addCourseToPlanReducer,
    deleteCourseFromPlan: deleteCourseFromPlanReducer,
    addCourseToAcademicYear: addCourseToAcademicYearReducer,
    deleteCourse: deleteCourseReducer,
    updateCourse: updateCourseReducer,
    //--------------School Class Reducers----------------//
    createSchoolClass: createSchoolClassReducer,
    updateSchoolClass: updateSchoolClassReducer,
    deleteSchoolClass: deleteSchoolClassReducer,
    //--------------Create Teacher Reducers----------------//
    createTeacher: createTeacherReducer,
    deleteTeacher: deleteTeacherReducer,
    addTeacherToCourse: addTeacherToCourseReducer,
    removeTeacherFromCourse: removeTeacherFromCourseReducer,
    addTeacherToStudyLevel: addTeacherToStudyLevelReducer,
    // --------------Schedule Reducers----------------//
    createSchedule: createScheduleReducer,
    updateSchedule: updateScheduleReducer,
    deleteSchedule: deleteScheduleReducer,
    addLecToSchedule: addLecToScheduleReducer,
    updateLecToSchedule: updateLecToScheduleReducer,
    deleteLecFromSchedule: deleteLecFromScheduleReducer,
    createScheduleDay: createScheduleDayReducer,
    updateScheduleDay: updateScheduleDayReducer,
    deleteScheduleDay: deleteScheduleDayReducer,
    // --------------Create Discount Code Reducers----------------//
    createDiscountCode: createDiscountCodeReducer,
    updateDiscountCode: updateDiscountCodeReducer,
    deleteDiscountCode: deleteDiscountCodeReducer,
    // --------------Create Job Discount Reducers----------------//
    createJobDiscount: createJobDiscountReducer,
    updateJobDiscount: updateJobDiscountReducer,
    deleteJobDiscount: deleteJobDiscountReducer,
    // --------------Problems Reducers----------------//
    deleteProblem: deleteProblemReducer,
    solveProblem: solveProblemReducer,
    // --------------selection Ids----------------//
    selectionIds: selectionIdsReducer,
    // --------------lectures----------------//
    lectures: lecturesReducer,
    video: lecturesVideoReducer,
    createLec: createLectureReducer,
    updateLec: updateLectureReducer,
    deleteLec: deleteLectureReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["lecturesVideo/fetchlecturesVideo/fulfilled"],
        ignoredPaths: ["lectureVideo.video"],
      },
    }),
});
