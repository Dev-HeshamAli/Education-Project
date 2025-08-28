import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
import { actCreateSchedule } from "../../store/schedule/actCreateSchedule";
import { resetCreateScheduleState } from "../../store/schedule/createScheduleSlice";
import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";

const validationSchema = yup.object().shape({
  scheduleName: yup.string().required("Schedule name is required"),
  studyLevelId: yup.number().required("Study level is required"),
  semesterId: yup.number().required("Semester is required"),
  academicYearId: yup.number().required("Academic year is required"),
});

const CreateSchedule = ({ studyLevelId, academicYearId, semesterId }) => {
  const dispatch = useDispatch();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      scheduleName: "",
      studyLevelId: "",
      semesterId: "",
      academicYearId: "",
    },
  });

  // Get data from Redux store
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const semesters = useSelector((state) => state.semestersId.list);
  const academicYears = useSelector((state) => state.academicYearsId.list);

  const { loading, error, success } = useSelector(
    (state) => state.createSchedule
  );

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchStudyLevels(token));
    dispatch(fetchSemesters(token));
    dispatch(fetchAcademicYears(token));
  }, [dispatch, token]);

  // ✨ هنا نعيّن الـ props جوه الفورم
  useEffect(() => {
    reset((prev) => ({
      ...prev,
      studyLevelId: studyLevelId || "",
      semesterId: semesterId || "",
      academicYearId: academicYearId || "",
    }));
  }, [studyLevelId, semesterId, academicYearId, reset]);

  const onSubmit = (data) => {
    const scheduleData = {
      name: data.scheduleName,
      academicYearId: data.academicYearId,
      semesterId: data.semesterId,
      studyLevelId: data.studyLevelId,
    };


    dispatch(actCreateSchedule({ token, data: scheduleData }));
  };

  useEffect(() => {
    if (success || error) {
      setTimeout(() => {
        dispatch(resetCreateScheduleState());
        reset({
          scheduleName: "",
          studyLevelId,
          semesterId,
          academicYearId,
        });
      }, 3000);
    }
  }, [
    success,
    error,
    dispatch,
    reset,
    studyLevelId,
    semesterId,
    academicYearId,
  ]);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Schedule
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Loading...
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Schedule Name */}
        <Controller
          name="scheduleName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Schedule Name"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
              placeholder="e.g., Schedule Pr1-CA1"
            />
          )}
        />

        {/* Study Level */}
        <Controller
          name="studyLevelId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              select
              label="Study Level"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            >
              {studyLevels.map((level) => (
                <MenuItem key={level.id} value={level.id}>
                  {level.level}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Semester */}
        <Controller
          name="semesterId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              select
              label="Semester"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            >
              {semesters.map((semester) => (
                <MenuItem key={semester.id} value={semester.id}>
                  {semester.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Academic Year */}
        <Controller
          name="academicYearId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              select
              label="Academic Year"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            >
              {academicYears.map((year) => (
                <MenuItem key={year.id} value={year.id}>
                  {year.date}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Submit Button */}
        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" size="large" fullWidth>
            Create Schedule
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateSchedule;
