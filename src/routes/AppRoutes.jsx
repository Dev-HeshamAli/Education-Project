import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "../pages/notFound/NotFound";
import DashboardLayout from "../layout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import StudentPage from "../pages/student/StudentPage";
import TeacherPage from "../pages/teacher/TeacherPage";
import ParentPage from "../pages/parent/ParentPage";
///* --------------------Admin---------------------- */
import CreateAdmin from "../pages/admin/createAdmin/CreateAdmin";
import DeleteAdmin from "../pages/admin/deleteAdmin/DeleteAdmin";
import UpdateAdmin from "../pages/admin/updateAdmin/UpdateAdmin";
///* --------------------Academic Year---------------------- */
import CreateAY from "../pages/academicYear/CreateAY";
import CreatePL from "../pages/academicYear/CreatePL";
import CreatePlan from "../pages/academicYear/CreatePlan";
import CreateStage from "../pages/academicYear/CreateStage";
import CreateSL from "../pages/academicYear/CreateSL";
import UpdatePL from "../pages/academicYear/UpdatePL";
import DeletePL from "../pages/academicYear/DeletePL";
import PlanDetails from "../pages/academicYear/PlanDetails";
///* --------------------Courses---------------------- */
import CreateCourse from "../pages/courses/CreateCourse";
import AddCourseToP from "../pages/courses/AddCourseToP";
import DeleteCourse from "../pages/courses/DeleteCourse";
import DeleteCourseFromP from "../pages/courses/DeleteCourseFromP";
import AddCourseToAY from "../pages/courses/AddCourseToAY";
import UpdateCourse from "../pages/courses/UpdateCourse";
import CoursesInSL from "../pages/courses/CoursesInSL";

// /* --------------------School Class---------------------- */
import CreateSchoolClass from "../pages/schoolClass/CreateSchoolClass";
import UpdateSchoolClass from "../pages/schoolClass/UpdateSchoolClass";
import DeleteSchoolClass from "../pages/schoolClass/DeleteSchoolClass";
import AddStudentToSchoolClass from "../pages/schoolClass/AddStudentToSchoolClass";
import RemoveStudentFromSchoolClass from "../pages/schoolClass/RemoveStudentFromSchoolClass";
// /* --------------------Teacher---------------------- */
import CreateTeacher from "../pages/adminActionToTeacher/CreateTeacher";
import DeleteTeacher from "../pages/adminActionToTeacher/DeleteTeacher";
// import AddTeacherToStudyLevel from "../pages/adminActionToTeacher/AddTeacherToStudyLevel";
import AddTeacherToCourse from "../pages/adminActionToTeacher/AddTeacherToCourse";
// import AddTeacherToClass from "../pages/adminActionToTeacher/AddTeacherToClass";
// /* --------------------schedule---------------------- */
import CreateSchedule from "../pages/schedule/CreateSchedule";
import ControlSchedule from "../pages/schedule/CONTROL/ControlSchedule";
import UpdateSchedule from "../pages/schedule/UpdateSchedule";
import AddLecToSchedule from "../pages/schedule/AddLecToSchedule";
import UpdateLecToSchedule from "../pages/schedule/UpdateLecToSchedule";
// /* --------------------Exam---------------------- */
import AddExam from "../pages/exam/AddExam";
import UpdateExam from "../pages/exam/UpdateExam";
import DeleteExam from "../pages/exam/DeleteExam";
// -------------------------Contact Us---------------------- */
import SolveProblem from "../pages/contactUs/SolveProblem";
import SolvedProblem from "../pages/contactUs/SolvedProblem";
import UnsolvedProblem from "../pages/contactUs/UnsolvedProblem";
import DeleteProblem from "../pages/contactUs/DeleteProblem";
// -----------------------Job Discount----------------------- */
import CreateJobDiscount from "../pages/jobDiscount/CreateJobDiscount";
// -----------------------------Discount Code----------------------- */
import CreateDiscountCode from "../pages/discountCode/CreateDiscountCode";
import DirectionProvider from "./DirectionProvider";

// -----------------------------Student----------------------- */
import GetStudentFromExcel from "../pages/adminActionToStudent/GetStudentFromExcel";
import UploadStudentFile from "../pages/adminActionToStudent/UploadStudentFile";
import AllApplications from "../pages/adminActionToStudent/AllApplications";
import AcceptanceApplication from "../pages/adminActionToStudent/AcceptanceApplication";
import RejectionApplication from "../pages/adminActionToStudent/RejectionApplication";
import AllLevelsInPlan from "../pages/academicYear/AllLevelsInPlan";
import AllDetailsCourses from "../pages/courses/MANAGE_ALL_COURSES/AllDetailsCourses";
import ManageClass from "../pages/schoolClass/ManageClass";
import LecVideo from "../pages/courseLec/LecVideo";
import UpdateLec from "../pages/schedule/CONTROL/UpdateLec";
import AllAdmains from "../pages/admin/allAdmins/AllAdmains";

//////////////////////////////////////////////////////
//////////////////main//////////////////////////
import Vision from "../pages/main/Vision";
import HomePage from "../pages/main/HomePage";
import KG1 from "../pages/main/KG1";
import TeacherCVPage from "../pages/main/TeacherCVPage";
import KG2 from "../pages/main/KG2";
import Prim1 from "../pages/main/Prim1";
import Prim2 from "../pages/main/Prim2";
import Prim3 from "../pages/main/Prim3";
import Prim4 from "../pages/main/Prim4";
////////////////parent/////////////////////////
import ContactUs from "../pages/parent/ContactUs";
import CreateChild from "../pages/parent/CreateChild";
import CreateDisChild from "../pages/parent/CreateDisChild";
import EditProfile from "../pages/parent/EditProfile";
import OfflineOnlineCoursesPlan from "../pages/parent/OfflineOnlineCoursesPlan";
import ParentDiscounts from "../pages/parent/ParentDiscounts";
import Problems from "../pages/parent/Problems";
import ParentProfile from "../pages/parent/ParentProfile";
import Requests from "../pages/parent/Requests";
import ShowPlans from "../pages/parent/ShowPlans";
import UpdateRequest from "../pages/parent/UpdateRequest";
import OnlinePlan from "../pages/parent/OnlinePlan";
///////////////student////////////////////////////

import EditStudent from "../pages/student/EditStudent";
import StudentAllCourses from "../pages/student/StudentAllCourses";
import StudentClassSchedule from "../pages/student/StudentClassSchedule";
import StudentCurrentCourses from "../pages/student/StudentCurrentCourses";
import StudentProfile from "../pages/student/StudentProfile";
//////////////////////////ai////////////////////////
import ChatWithLecture from "../pages/student/ChatWithlecture";
import CourseLectures from "../pages/student/CourseLectures";
import QuizPage from "../pages/student/QuizPage";
import SummarizePage from "../pages/student/SummarizePage";
import TranslatePage from "../pages/student/TranslatePage";
import WatchLecture from "../pages/student/WatchLecture";
import CourseDetails from "../pages/student/CourseDetails";

///////////////////forget password////////////////////
import ConfirmCode from "../pages/ForgotPassword/ConfirmCode";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";
import RegisterParent from "../pages/main/RegisterParent";
import TeacherProfile from "../pages/teacher/TeacherProfile";
import TeacherSchedule from "../pages/teacher/TeacherSchedule";
import Students from "../pages/teacher/Students";
import Reports from "../pages/teacher/Reports";

const AppRoutes = () => {
  const role = useSelector((state) => state.auth.role);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/** main routes */}

      <Route path="/login" element={<Login />} />
      <Route path="/vision" element={<Vision />} />
      <Route path="/home" element={<HomePage />} />

      <Route path="/kg1" element={<KG1 />} />
      <Route path="/kg2" element={<KG2 />} />
      <Route path="/prim1" element={<Prim1 />} />
      <Route path="/prim2" element={<Prim2 />} />
      <Route path="/prim3" element={<Prim3 />} />
      <Route path="/prim4" element={<Prim4 />} />
      <Route path="/teachers" element={<TeacherCVPage />} />

      <Route path="/register" element={<RegisterParent />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/confirm-code" element={<ConfirmCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {Array.isArray(role) && role.includes("Admin__Role") && (
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DirectionProvider>
                <DashboardLayout />
              </DirectionProvider>
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          {/* --------------------Admin---------------------- */}
          <Route path="create-admin" element={<CreateAdmin />} />
          <Route path="update-admin" element={<UpdateAdmin />} />
          <Route path="delete-admin" element={<DeleteAdmin />} />
          <Route path="all-admins" element={<AllAdmains />} />
          {/* --------------------Academic Year---------------------- */}
          <Route path="create-academic-year" element={<CreateAY />} />
          <Route path="create-plan" element={<CreatePlan />} />
          <Route path="create-study-level" element={<CreateSL />} />
          <Route path="create-stage" element={<CreateStage />} />
          <Route path="plan-details" element={<PlanDetails />} />
          <Route
            path="all-study-levels-in-plan"
            element={<AllLevelsInPlan />}
          />
          {/* --------------------Courses---------------------- */}
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="courses-in-study-level" element={<CoursesInSL />} />
          <Route path="update-course" element={<UpdateCourse />} />
          <Route path="add-course-to-plan" element={<AddCourseToP />} />
          <Route
            path="delete-course-from-plan"
            element={<DeleteCourseFromP />}
          />
          <Route path="delete-course" element={<DeleteCourse />} />
          <Route path="courses-details" element={<AllDetailsCourses />} />
          <Route path="lectures-in-course" element={<LecVideo />} />
          {/* <Route
            path="add-course-to-academic-year"
            element={<AddCourseToAY />}
          /> */}
          {/* --------------------School Class---------------------- */}
          <Route path="create-school-class" element={<CreateSchoolClass />} />
          <Route path="manage-school-class" element={<ManageClass />} />
          <Route path="update-school-class" element={<UpdateSchoolClass />} />
          <Route path="delete-school-class" element={<DeleteSchoolClass />} />
          <Route
            path="add-student-to-school-class"
            element={<AddStudentToSchoolClass />}
          />
          <Route
            path="remove-student-from-school-class"
            element={<RemoveStudentFromSchoolClass />}
          />
          {/* --------------------Teacher---------------------- */}
          <Route path="create-teacher" element={<CreateTeacher />} />
          <Route path="delete-teacher" element={<DeleteTeacher />} />
          {/* <Route
            path="add-teacher-to-study-level"
            element={<AddTeacherToStudyLevel />}
          /> */}
          <Route
            path="add-teacher-to-course"
            element={<AddTeacherToCourse />}
          />
          {/* <Route path="add-teacher-to-class" element={<AddTeacherToClass />} /> */}

          {/* --------------------schedule---------------------- */}

          <Route path="create-schedule" element={<CreateSchedule />} />
          <Route path="update-schedule" element={<UpdateSchedule />} />
          <Route path="control-schedule" element={<ControlSchedule />} />
          <Route path="add-lec-to-schedule" element={<AddLecToSchedule />} />
          <Route
            path="update-lec-to-schedule"
            element={<UpdateLecToSchedule />}
          />
          <Route path="UPDATE" element={<UpdateLec />} />
          {/* --------------------Exam---------------------- */}
          <Route path="add-exam" element={<AddExam />} />
          <Route path="update-exam" element={<UpdateExam />} />
          <Route path="delete-exam" element={<DeleteExam />} />
          {/* --------------------Contact Us---------------------- */}
          <Route path="solve-problem" element={<SolveProblem />} />
          <Route path="solved-problem" element={<SolvedProblem />} />
          <Route path="unsolved-problem" element={<UnsolvedProblem />} />
          <Route path="delete-problem" element={<DeleteProblem />} />
          {/* -----------------------Job Discount----------------------- */}
          <Route path="create-job-discount" element={<CreateJobDiscount />} />
          {/* -----------------------------Discount Code----------------------- */}
          <Route path="create-discount-code" element={<CreateDiscountCode />} />
          {/* -----------------------------Student----------------------- */}
          <Route path="get-students" element={<GetStudentFromExcel />} />
          <Route path="upload-student" element={<UploadStudentFile />} />
          <Route path="all-applications" element={<AllApplications />} />
          <Route
            path="acceptance-application"
            element={<AcceptanceApplication />}
          />
          <Route
            path="rejection-application"
            element={<RejectionApplication />}
          />
        </Route>
      )}
      {Array.isArray(role) && role.includes("Student") && (
        <Route
          path="/student"
          element={
            <PrivateRoute>
              <StudentPage />
            </PrivateRoute>
          }
        >
          <Route index element={<StudentProfile />} />

          <Route path="student-profile" element={<StudentProfile />} />
          <Route path="edit-profile" element={<EditStudent />} />
          <Route path="current-courses" element={<StudentCurrentCourses />} />
          <Route path="all-courses" element={<StudentAllCourses />} />
          <Route path="class-Schedule" element={<StudentClassSchedule />} />
          <Route
            path="course-lectures/:courseId"
            element={<CourseLectures />}
          />
          <Route path="course-details/:courseId" element={<CourseDetails />} />

          <Route path="watch-lecture/:id" element={<WatchLecture />} />
          <Route path="quiz-page/:id" element={<QuizPage />} />
          <Route path="summarize-page/:id" element={<SummarizePage />} />
          <Route path="translate-page/:id" element={<TranslatePage />} />
          <Route path="chat-page/:id" element={<ChatWithLecture />} />
        </Route>
      )}
      {Array.isArray(role) && role.includes("Teacher") && (
        <Route
          path="/teacher"
          element={
            <PrivateRoute>
              <DirectionProvider>
                <TeacherPage />
              </DirectionProvider>
            </PrivateRoute>
          }
        >
          <Route index element={<TeacherProfile />} />
          <Route path="schedule" element={<TeacherSchedule />} />
          <Route path="students" element={<Students />} />
          <Route path="report" element={<Reports />} />
        </Route>
      )}
      <Route
        path="/parent"
        element={
          <PrivateRoute>
            <ParentPage />
          </PrivateRoute>
        }
      >
        <Route index element={<ParentProfile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="create-child" element={<CreateChild />} />
        <Route path="create-dis-child" element={<CreateDisChild />} />
        <Route path="requests" element={<Requests />} />
        <Route path="request-info" element={<UpdateRequest />} />
        <Route path="parent-profile" element={<ParentProfile />} />
        <Route path="discount" element={<ParentDiscounts />} />
        <Route path="problems" element={<Problems />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="/parent/plans/:studentId" element={<ShowPlans />} />
        <Route path="online-plan/:planId/:studentId" element={<OnlinePlan />} />

        <Route
          path="courses-plan/:planId/:studentId"
          element={<OfflineOnlineCoursesPlan />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
