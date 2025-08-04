import { Box, Button } from "@mui/material";
import { useEffect } from "react";
// import { logout } from "../../store/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
// import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
// import { fetchPlans } from "../../store/shared/plan/actGetPlan";
// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchCoursesStudyLevels } from "../../store/shared/coursesStudyLevel/actGetCoursesStudyLevel";
// import { fetchStages } from "../../store/shared/stage/actGetStage";
// import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
// import { useDispatch } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();
  // const admin = JSON.parse(localStorage.getItem("userInfo"));
  // // const id = admin?.id;
  // console.log(admin);

  // const role = useSelector((state) => state.auth.role);
  // console.log(role);

  // const userData = useSelector((state) => state.auth.userData);
  // console.log(userData);
  // const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   // dispatch(fetchAcademicYears());
  //   // dispatch(fetchStudyLevels());
  //   // dispatch(fetchPlans());
  //   // dispatch(fetchStages());
  //   // dispatch(fetchSemesters());
  //   dispatch(fetchCoursesStudyLevels(token));
  // }, [dispatch , token]);

  // const plans = useSelector((state) => state.plansId.list);
  // const coursesStudyLevelsId = useSelector(
  //   (state) => state.coursesStudyLevelsId.list
  // );
  // const studyLevels = useSelector((state) => state.studyLevelsId.list);
  // const stages = useSelector((state) => state.stageId.list);
  // const semesters = useSelector((state) => state.semestersId.list);
  // const academicYears = useSelector((state) => state.academicYearsId.list);
  // console.log("coursesStudyLevelsId", coursesStudyLevelsId);

  return (
    <Box>
      <h1>Dashboard</h1>
      {/* <Button
        onClick={() => {
          dispatch(logout());
        }}
        variant="contained"
        color="primary"
      >
        logout
      </Button> */}
    </Box>
  );
};

export default Dashboard;
