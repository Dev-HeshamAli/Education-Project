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
import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";
import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
import { actCreateSchedule } from "../../store/schedule/actCreateSchedule";
import { resetCreateScheduleState } from "../../store/schedule/createScheduleSlice";

const validationSchema = yup.object().shape({
  studyLevelId: yup.number().required("Study level is required"),
  schoolClassId: yup.number().required("Class is required"),
  semesterId: yup.number().required("Semester is required"),
  scheduleName: yup.string().required("Schedule name is required"),
  scheduleDate: yup.date().required("Date is required"),
});

const CreateSchedule = () => {
  const dispatch = useDispatch();

  const { control, handleSubmit, watch, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      scheduleName: "",
      scheduleDate: "",
      studyLevelId: "",
      schoolClassId: "",
      semesterId: "",
    },
  });

  // Get data from Redux store
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const schoolClasses = useSelector((state) => state.schoolClassId.list);
  const semesters = useSelector((state) => state.semestersId.list);
  const { loading, error, success } = useSelector(
    (state) => state.createSchedule
  );

  const token = useSelector((state) => state.auth.token);

  const selectedStudyLevel = watch("studyLevelId");

  useEffect(() => {
    // Initial data fetch
    dispatch(fetchStudyLevels(token));
    dispatch(fetchSemesters(token));
  }, [dispatch, token]);

  useEffect(() => {
    // Fetch school classes when study level is selected
    if (selectedStudyLevel) {
      dispatch(fetchSchoolClassId({ token, id: selectedStudyLevel }));
    }
  }, [dispatch, selectedStudyLevel, token]);

  const onSubmit = (data) => {
    const scheduleData = {
      name: data.scheduleName,
      date: new Date(data.scheduleDate).toLocaleDateString("en-CA"),
      semesterId: data.semesterId,
      school_ClassId: data.schoolClassId,
    };
    console.log("Schedule data to submit:", scheduleData);

    dispatch(actCreateSchedule({ token, data: scheduleData }));
  };

  useEffect(() => {
    // Clear messages on component mount
    if (success || error) {
      setTimeout(() => {
        dispatch(resetCreateScheduleState());
        reset();
      }, 3000);
    }
  }, [success, error, dispatch, reset]);

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
        <Controller
          name="scheduleName"
          control={control}
          defaultValue=""
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

        <Controller
          name="scheduleDate"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Schedule Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="studyLevelId"
          control={control}
          defaultValue=""
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

        <Controller
          name="schoolClassId"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              select
              label="Class"
              fullWidth
              margin="normal"
              disabled={!selectedStudyLevel}
              error={!!error}
              helperText={error?.message}
            >
              {schoolClasses.map((schoolClass) => (
                <MenuItem key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="semesterId"
          control={control}
          defaultValue=""
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
