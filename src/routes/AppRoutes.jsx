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
///* --------------------Courses---------------------- */
import CreateCourse from "../pages/courses/CreateCourse";
import AddCourseToP from "../pages/courses/AddCourseToP";
import DeleteCourse from "../pages/courses/DeleteCourse";
import DeleteCourseFromP from "../pages/courses/DeleteCourseFromP";
import AddCourseToAY from "../pages/courses/AddCourseToAY";
import UpdateCourse from "../pages/courses/UpdateCourse";
// /* --------------------School Class---------------------- */
import CreateSchoolClass from "../pages/schoolClass/CreateSchoolClass";
import UpdateSchoolClass from "../pages/schoolClass/UpdateSchoolClass";
import DeleteSchoolClass from "../pages/schoolClass/DeleteSchoolClass";
import AddStudentToSchoolClass from "../pages/schoolClass/AddStudentToSchoolClass";
import RemoveStudentFromSchoolClass from "../pages/schoolClass/RemoveStudentFromSchoolClass";
// /* --------------------Teacher---------------------- */
import CreateTeacher from "../pages/adminActionToTeacher/CreateTeacher";
import DeleteTeacher from "../pages/adminActionToTeacher/DeleteTeacher";
import AddTeacherToStudyLevel from "../pages/adminActionToTeacher/AddTeacherToStudyLevel";
import AddTeacherToCourse from "../pages/adminActionToTeacher/AddTeacherToCourse";
import AddTeacherToClass from "../pages/adminActionToTeacher/AddTeacherToClass";
// /* --------------------schedule---------------------- */
import CreateSchedule from "../pages/schedule/CreateSchedule";
import UpdateSchedule from "../pages/schedule/UpdateSchedule";
import DeleteSchedule from "../pages/schedule/DeleteSchedule";
import AddLecToSchedule from "../pages/schedule/AddLecToSchedule";
import UpdateLecToSchedule from "../pages/schedule/UpdateLecToSchedule";
import DeleteLecFromSchedule from "../pages/schedule/DeleteLecFromSchedule";
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
import UpdateJobDiscount from "../pages/jobDiscount/UpdateJobDiscount";
import DeleteJobDiscount from "../pages/jobDiscount/DeleteJobDiscount";
// -----------------------------Discount Code----------------------- */
import CreateDiscountCode from "../pages/discountCode/CreateDiscountCode";
import UpdateDiscountCode from "../pages/discountCode/UpdateDiscountCode";
import DeleteDiscountCode from "../pages/discountCode/DeleteDiscountCode";
// -----------------------------Student----------------------- */
import GetStudentFromExcel from "../pages/adminActionToStudent/GetStudentFromExcel";
import UploadStudentFile from "../pages/adminActionToStudent/UploadStudentFile";
import AllApplications from "../pages/adminActionToStudent/AllApplications";
import AcceptanceApplication from "../pages/adminActionToStudent/AcceptanceApplication";
import RejectionApplication from "../pages/adminActionToStudent/RejectionApplication";

const AppRoutes = () => {
  const role = useSelector((state) => state.auth.role);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {Array.isArray(role) && role.includes("Admin__Role") && (
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          {/* --------------------Admin---------------------- */}
          <Route path="create-admin" element={<CreateAdmin />} />
          <Route path="update-admin" element={<UpdateAdmin />} />
          <Route path="delete-admin" element={<DeleteAdmin />} />
          {/* --------------------Academic Year---------------------- */}
          <Route path="create-academic-year" element={<CreateAY />} />
          <Route path="create-plan" element={<CreatePlan />} />
          <Route path="create-stage" element={<CreateStage />} />
          <Route path="create-plan-level" element={<CreatePL />} />
          <Route path="create-study-level" element={<CreateSL />} />
          <Route path="update-plan-level" element={<UpdatePL />} />
          {/* --------------------Courses---------------------- */}
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="update-course" element={<UpdateCourse />} />
          <Route path="add-course-to-plan" element={<AddCourseToP />} />
          <Route
            path="delete-course-from-plan"
            element={<DeleteCourseFromP />}
          />
          <Route path="delete-course" element={<DeleteCourse />} />
          <Route
            path="add-course-to-academic-year"
            element={<AddCourseToAY />}
          />
          {/* --------------------School Class---------------------- */}
          <Route path="create-school-class" element={<CreateSchoolClass />} />
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
          <Route
            path="add-teacher-to-study-level"
            element={<AddTeacherToStudyLevel />}
          />
          <Route
            path="add-teacher-to-course"
            element={<AddTeacherToCourse />}
          />
          <Route path="add-teacher-to-class" element={<AddTeacherToClass />} />

          {/* --------------------schedule---------------------- */}

          <Route path="create-schedule" element={<CreateSchedule />} />
          <Route path="update-schedule" element={<UpdateSchedule />} />
          <Route path="delete-schedule" element={<DeleteSchedule />} />
          <Route path="add-lec-to-schedule" element={<AddLecToSchedule />} />
          <Route
            path="update-lec-to-schedule"
            element={<UpdateLecToSchedule />}
          />
          <Route
            path="delete-lec-from-schedule"
            element={<DeleteLecFromSchedule />}
          />
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
          <Route path="update-job-discount" element={<UpdateJobDiscount />} />
          <Route path="delete-job-discount" element={<DeleteJobDiscount />} />
          {/* -----------------------------Discount Code----------------------- */}
          <Route path="create-discount-code" element={<CreateDiscountCode />} />
          <Route path="update-discount-code" element={<UpdateDiscountCode />} />
          <Route path="delete-discount-code" element={<DeleteDiscountCode />} />
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
        />
      )}
      {Array.isArray(role) && role.includes("Teacher") && (
        <Route
          path="/teacher"
          element={
            <PrivateRoute>
              <TeacherPage />
            </PrivateRoute>
          }
        />
      )}
      {Array.isArray(role) && role.includes("Parent") && (
        <Route
          path="/parent"
          element={
            <PrivateRoute>
              <ParentPage />
            </PrivateRoute>
          }
        />
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
