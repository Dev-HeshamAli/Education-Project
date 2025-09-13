import { useEffect, useCallback } from "react";
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
import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
import { actUpdateSchedule } from "../../store/schedule/updateSchedule/actUpdateSchedule";
import { actDeleteSchedule } from "../../store/schedule/deleteSchedule/actDeleteSchedule";
import { resetUpdateScheduleState } from "../../store/schedule/updateSchedule/updateScheduleSlice";
import { resetDeleteScheduleState } from "../../store/schedule/deleteSchedule/deleteScheduleSlice";
import { actGetScheduleTime } from "../../store/shared/scheduleTime/actGetScheduleTime";

const validationSchema = yup.object().shape({
  scheduleName: yup.string().required("Schedule name is required"),
  studyLevelId: yup.number().required("Study level is required"),
  semesterId: yup.number().required("Semester is required"),
  academicYearId: yup.number().required("Academic year is required"),
  scheduleTimeId: yup.number().required("Schedule time is required"),
});

const UpdateSchedule = ({
  studyLevelId,
  academicYearId,
  scheduleTimeId,
  semesterId,
  name,
  onClose,
  action = "update", // إضافة قيمة افتراضية
}) => {
  const dispatch = useDispatch();
  const { scheduleId } = useSelector((state) => state.selectinIdsForSchedule);
  // console.log(scheduleId);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      scheduleTimeId: scheduleTimeId || "",
      scheduleName: name || "",
      studyLevelId: studyLevelId || "",
      semesterId: semesterId || "",
      academicYearId: academicYearId || "",
    },
  });

  // Get data from Redux store
  const studyLevels = useSelector((state) => state.studyLevelsId?.list || []);
  const semesters = useSelector((state) => state.semestersId?.list || []);
  const academicYears = useSelector(
    (state) => state.academicYearsId?.list || []
  );
  const scheduleTimes = useSelector((state) => state.scheduleTime.list);

  const {
    error: deleteError,
    loading: deleteLoading,
    success: deleteSuccess,
  } = useSelector((state) => state.deleteSchedule || {});

  const {
    error: updateError,
    loading: updateLoading,
    success: updateSuccess,
  } = useSelector((state) => state.updateSchedule || {});

  const token = useSelector((state) => state.auth?.token);

  // Fetch initial data
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
      dispatch(fetchSemesters(token));
      dispatch(fetchAcademicYears(token));
      dispatch(actGetScheduleTime());
    }
  }, [dispatch, token]);

  // Update form when props change
  useEffect(() => {
    reset({
      scheduleTime: scheduleTimeId || "",
      scheduleName: name || "",
      studyLevelId: studyLevelId || "",
      semesterId: semesterId || "",
      academicYearId: academicYearId || "",
    });
  }, [studyLevelId, semesterId, academicYearId, name, reset, scheduleTimeId]);

  // Handle update action
  const onUpdate = useCallback(
    (data) => {
      if (!scheduleId) {
        console.error("Schedule ID is missing");
        return;
      }

      const scheduleData = {
        id: scheduleId,
        scheduleTimeId: Number(data.scheduleTimeId),
        name: data.scheduleName,
        academicYearId: Number(data.academicYearId),
        semesterId: Number(data.semesterId),
        studyLevelId: Number(data.studyLevelId),
      };

      dispatch(actUpdateSchedule({ token, data: scheduleData }));
    },
    [scheduleId, token, dispatch]
  );

  // Handle delete action
  const onDelete = useCallback(
    (e) => {
      e.preventDefault();

      if (!scheduleId) {
        return;
      }

      dispatch(actDeleteSchedule({ token, id: scheduleId }));
    },
    [scheduleId, token, dispatch]
  );

  // Reset state after success/error
  useEffect(() => {
    if (updateSuccess || updateError || deleteSuccess || deleteError) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateScheduleState());
        dispatch(resetDeleteScheduleState());
        onClose();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    updateSuccess,
    updateError,
    deleteSuccess,
    deleteError,
    dispatch,
    reset,
    onClose,
    studyLevelId,
    semesterId,
    academicYearId,
  ]);

  // Loading state
  const isLoading = updateLoading || deleteLoading;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {action === "update" ? "Update" : "Delete"} Schedule
      </Typography>

      {/* Error and Success Alerts */}
      {deleteError && (
        <Alert sx={{ mb: 2 }} severity="error">
          Delete Error: {deleteError}
        </Alert>
      )}
      {deleteSuccess && (
        <Alert sx={{ mb: 2 }} severity="success">
          {deleteSuccess}
        </Alert>
      )}
      {updateError && (
        <Alert sx={{ mb: 2 }} severity="error">
          Update Error: {updateError}
        </Alert>
      )}
      {updateSuccess && (
        <Alert sx={{ mb: 2 }} severity="success">
          {updateSuccess}
        </Alert>
      )}
      {isLoading && (
        <Alert sx={{ mb: 2 }} severity="info">
          Loading...
        </Alert>
      )}

      {/* Form for Update */}
      {action === "update" && (
        <form onSubmit={handleSubmit(onUpdate)}>
          {/* Schedule Time */}
          <Controller
            name="scheduleTimeId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                label="Schedule Time"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>Select Schedule Time</em>
                </MenuItem>
                {scheduleTimes.map((time) => (
                  <MenuItem key={time.id} value={time.id}>
                    {time.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
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
                disabled={isLoading}
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
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>Select Study Level</em>
                </MenuItem>
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
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>Select Semester</em>
                </MenuItem>
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
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>Select Academic Year</em>
                </MenuItem>
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
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
              color="primary"
            >
              {updateLoading ? "Updating..." : "Update Schedule"}
            </Button>
          </Box>
        </form>
      )}

      {/* Delete Action */}
      {action === "delete" && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the schedule:{" "}
            <strong>{name}</strong>?
          </Typography>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onDelete}
            disabled={isLoading}
            color="error"
          >
            {deleteLoading ? "Deleting..." : "Delete Schedule"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UpdateSchedule;
