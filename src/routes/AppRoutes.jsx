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
import { useSelector } from "react-redux";

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
