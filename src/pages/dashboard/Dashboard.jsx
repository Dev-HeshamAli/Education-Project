import { Box, Typography } from "@mui/material";
// import { useEffect } from "react";
// import { logout } from "../../store/auth/authSlice";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import { actGetScheduleInfo } from "../../store/shared/getScheduleId/schedule/actGetScheduleInfo";
// import { fetchProblems } from "../../store/shared/problems/actGetProblems";
// import { fetchSolvedProblems } from "../../store/shared/solvedProblems/actGetSolvedProblems";
// import { actDeleteJobDiscount } from "../../store/createJobDiscount/deleteJobDiscount/actdeleteJobDiscount";
// import { fetchJobDiscount } from "../../store/shared/jobDiscount/actGetJobDiscount";
// import { refreshAccessToken } from "../../store/auth/refreshAccessToken";
// import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
// import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
// import { fetchPlans } from "../../store/shared/plan/actGetPlan";
// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
// import { fetchCoursesStudyLevels } from "../../store/shared/coursesStudyLevel/actGetCoursesStudyLevel";
// import { fetchStages } from "../../store/shared/stage/actGetStage";
// import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
// import { useDispatch } from "react-redux";
// import { actGetStudentIdByClass } from "../../store/shared/studentIdByClass/actGetStudentIdByClass";
// import { actGetScheduleId } from "../../store/shared/getScheduleId/actGetScheduleId";

const Dashboard = () => {
  // const dispatch = useDispatch();

  // const getProblemsState = useSelector((state) => state.problems);
  // const problems = getProblemsState?.list || [];

  // const solvedProblemsState = useSelector((state) => state.solvedProblems);
  // const solvedList = solvedProblemsState?.list || [];

  // console.log(solvedList);
  // // console.log(solvedList);

  // const token = useSelector((state) => state.auth.token);

  // const admin = JSON.parse(localStorage.getItem("userInfo"));
  // // const id = admin?.id;
  // console.log(admin);

  // const role = useSelector((state) => state.auth.role);
  // console.log(role);

  // const userData = useSelector((state) => state.auth.userData);
  // const schedulreInfo = useSelector((state) => state.getScheduleInfo.list);
  // console.log(schedulreInfo);

  // const dispatch = useDispatch();
  // const {userData} = useSelector((state) => state.teacherByName.list);
  // console.log(userData);

  // const token = useSelector((state) => state.auth.token);

  // const data = useSelector((state) => state.jobDiscount.list);
  // console.log(data);

  // useEffect(() => {
  //   // dispatch(fetchAcademicYears());
  //   // dispatch(fetchStudyLevels());
  //   // dispatch(fetchPlans());
  //   // dispatch(fetchStages());
  //   // dispatch(fetchSemesters());
  //   // dispatch(fetchCoursesStudyLevels(token));
  //   // dispatch(actGetStudentIdByClass({ token }));
  //   // dispatch(fetchTeachersByName({ token , name: "ddddd" }));
  //   // dispatch(fetchJobDiscount( token ));

  // }, [dispatch, token]);

  // useEffect(() => {
  //   dispatch(fetchProblems(token));
  //   dispatch(fetchSolvedProblems(token));
  // }, [dispatch, token]);

  // const plans = useSelector((state) => state.plansId.list);
  // const coursesStudyLevelsId = useSelector(
  //   (state) => state.coursesStudyLevelsId.list
  // );
  // const studyLevels = useSelector((state) => state.studyLevelsId.list);
  // const stages = useSelector((state) => state.stageId.list);
  // const semesters = useSelector((state) => state.semestersId.list);
  // const academicYears = useSelector((state) => state.academicYearsId.list);
  // console.log("coursesStudyLevelsId", coursesStudyLevelsId);

  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------

  // const dispatch = useDispatch();

  // useEffect(() => {
    // dispatch(refreshAccessToken());
    // dispatch(
    //   actGetScheduleInfo({
    //     token,
    //     studyLevelId: 14,
    //     semesterId: 1,
    //     academicYearId: 23,
    //   })
    // );
    // dispatch(actGetScheduleId({token, id: SchoolClassId}));
  // }, [dispatch, token]);

  // const scheduleId = useSelector((state) => state.getScheduleId.list);
  // console.log("scheduleId", scheduleId);

  return (
    <Box textAlign={"center"}>
      {/* <h1>Dashboard</h1> */}
      {/* <Button
        onClick={() => {
          dispatch(logout());
        }}
        variant="contained"
        color="primary"
      >
        logout
      </Button> */}
      {/* <Button
        onClick={() => {
          dispatch(actDeleteJobDiscount({ id: 1, token: token }));
        }}
        variant="contained"
        color="primary"
      >
        Delete
      </Button> */}

      <Typography variant="h2" color="initial">
        PlatformAdmin987@gmail.com
      </Typography>
      <Typography variant="h2" color="initial">
        P@ssword123
      </Typography>
    </Box>
  );
};

export default Dashboard;
