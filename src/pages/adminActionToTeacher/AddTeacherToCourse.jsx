import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Alert,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { actAddTeacherToCourse } from "../../store/addTeacherToCourse/actAddTeacherToCourse";
import { clearMessageAddTeacherToCourse } from "../../store/addTeacherToCourse/addTeacherToCourseSlice";
import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";
import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
import {
  setPlanId,
  setStudyLevelId,
  setSemesterId,
  setCourseId,
} from "../../store/LOCAL_DATA/selectinIdsSlice";
import { actanyCourseNameLevel } from "../../store/shared/anyCourseName/actanyCourseNameLevel";

const AddTeacherToCourseSimple = ({ onTeacherAdded }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { loading, success, error } = useSelector(
    (state) => state.addTeacherToCourse
  );

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  

  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const plans = useSelector((state) => state.plansId.list);
  const coursesStudyLevels = useSelector((state) => state.anyCourseName.list);

  const teacherNames = useSelector((state) => state.teacherByName?.list || []);
  const semesters = useSelector((state) => state.semestersId.list);

  const { planId, studyLevelId, semesterId, courseId } = useSelector(
    (state) => state.selectionIds
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
      dispatch(fetchPlans(token));
      dispatch(fetchSemesters(token));
    }
  }, [dispatch, token, planId, studyLevelId, semesterId]);

  useEffect(() => {
    if (studyLevelId) {
      dispatch(fetchSchoolClassId({ token, id: studyLevelId }));
    }
  }, [studyLevelId, dispatch, token]);

  // fetch courses & teachers عند تغيير Plan و Study Level
  useEffect(() => {
    if (planId && studyLevelId && token && semesterId) {
      dispatch(
        actanyCourseNameLevel({
          token,
          studyLevelId: studyLevelId,
          planId: planId,
          semesterId: semesterId,
        })
      );
    }
  }, [planId, studyLevelId, dispatch, token, semesterId]);

  // Submit
  // const handleSubmit = () => {
  //   if (!selectedTeacher || !courseId) return;
  //   dispatch(
  //     actAddTeacherToCourse({
  //       teacherId: selectedTeacher.id,
  //       courseId: courseId,
  //       token,
  //     })
  //   );
  // };

  const handleSubmit = () => {
    if (!selectedTeacher || !courseId) return;
    dispatch(
      actAddTeacherToCourse({
        teacherId: selectedTeacher.id,
        courseId: courseId,
        token,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        onTeacherAdded(selectedTeacher);
      }
    });
  };

  // تفريغ الرسائل بعد 3 ثواني
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessageAddTeacherToCourse());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  return (
    <Box
      sx={{
        mx: "auto",
        m: 5,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        Assign Teacher to Course
      </Typography>

      {loading && <CircularProgress />}
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Autocomplete Teacher */}
      <Autocomplete
        options={teacherNames}
        getOptionLabel={(option) => option?.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        value={selectedTeacher}
        onChange={(e, value) => setSelectedTeacher(value)}
        onInputChange={(e, value) => {
          if (value && value.length >= 2) {
            dispatch(fetchTeachersByName({ token, name: value }));
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search Teacher" />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            {option.name}
          </Box>
        )}
      />

      <FormControl fullWidth>
        <InputLabel>Study Level</InputLabel>
        <Select
          value={studyLevelId}
          onChange={(e) => dispatch(setStudyLevelId(e.target.value))}
        >
          <MenuItem value="">Select Study Level</MenuItem>
          {studyLevels.map((lvl) => (
            <MenuItem key={lvl.id} value={lvl.id}>
              {lvl.level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Semester</InputLabel>
        <Select
          value={semesterId}
          onChange={(e) => dispatch(setSemesterId(e.target.value))}
        >
          <MenuItem value="">Select Semester</MenuItem>
          {semesters.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Plan</InputLabel>
        <Select
          value={planId}
          onChange={(e) => dispatch(setPlanId(e.target.value))}
        >
          <MenuItem value="">Select Plan</MenuItem>
          {plans.map((plan) => (
            <MenuItem key={plan.id} value={plan.id}>
              {plan.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Course</InputLabel>
        <Select
          value={courseId}
          onChange={(e) => dispatch(setCourseId(e.target.value))}
        >
          <MenuItem value="">Select Course</MenuItem>
          {coursesStudyLevels && coursesStudyLevels.length > 0 ? (
            coursesStudyLevels.map((c) => (
              <MenuItem key={c.id || c.courseId} value={c.id || c.courseId}>
                {c.name || c.courseName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No courses available</MenuItem>
          )}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!selectedTeacher || !courseId}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddTeacherToCourseSimple;
