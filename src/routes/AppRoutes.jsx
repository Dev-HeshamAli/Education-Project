import { Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "../pages/notFound/NotFound";
import DashboardLayout from "../layout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

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
        <Route path="delete-course-from-plan" element={<DeleteCourseFromP />} />
        <Route path="delete-course" element={<DeleteCourse />} />
        <Route path="add-course-to-academic-year" element={<AddCourseToAY />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
