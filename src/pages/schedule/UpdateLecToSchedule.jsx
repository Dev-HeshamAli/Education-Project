import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Autocomplete,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";
import { actGetScheduleId } from "../../store/shared/getScheduleId/actGetScheduleId";
import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
import { actUpdateLecToSchedule } from "../../store/schedule/updateLecToSchedule/actUpdateLecToSchedule";
import { clearMessageUpdateLecToSchedule } from "../../store/schedule/updateLecToSchedule/updateLecToScheduleSlice";
import { actDeleteLecFromSchedule } from "../../store/schedule/deleteLecFromSchedule/actDeleteLecFromSchedule";
import { resetDeleteLecFromScheduleState } from "../../store/schedule/deleteLecFromSchedule/deleteLecFromScheduleSlice";
import { actGetCoursesInStudyLevel } from "../../store/shared/coursesInStudyLevel/actGetCoursesInStudyLevel";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";

// Schema validation
const schema = yup.object().shape({
  teacher: yup
    .object()
    .nullable()
    .required("Teacher is required")
    .typeError("Teacher is required"),
  course: yup.object().nullable().required("Course is required"),

  startTime: yup.string().required("Start time is required"),
  endTime: yup
    .string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        return !startTime || !value || value > startTime;
      }
    ),
});

const UpdateLecToSchedule = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const studyLevels = useSelector((state) => state.studyLevelsId?.list || []);
  const classesList = useSelector((state) => state.schoolClassId?.list || []);
  const scheduleData = useSelector((state) => state.getScheduleId?.list || {});
  const teacherNames = useSelector((state) => state.teacherByName?.list || []);
  const plans = useSelector((state) => state.plansId.list);
  const coursesStudyLevels = useSelector(
    (state) => state.coursesInStudyLevels.list?.courses
  );

  const { error, loading, success } = useSelector(
    (state) => state.updateLecToSchedule
  );

  const {
    error: deleteError,
    loading: deleteLoading,
    success: deleteSuccess,
  } = useSelector((state) => state.deleteLecFromSchedule);

  const [studyLevel, setStudyLevel] = useState("");
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editLecture, setEditLecture] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Load study levels
  useEffect(() => {
    dispatch(fetchPlans(token));
    dispatch(fetchStudyLevels(token));
  }, [dispatch, token]);

  // Load classes when study level changes
  useEffect(() => {
    if (studyLevel) {
      dispatch(fetchSchoolClassId({ token, id: studyLevel }));
    }
  }, [dispatch, token, studyLevel]);

  // Load schedule when class and date are selected
  useEffect(() => {
    if (classId && date) {
      dispatch(actGetScheduleId({ token, id: classId, date }));
    }
    if (success || deleteSuccess) {
      dispatch(actGetScheduleId({ token, id: classId, date }));
    }
  }, [dispatch, token, classId, date, success, deleteSuccess]);

  // Load courses for editing
  useEffect(() => {
    if (editLecture) {
      const levelId = editLecture.studyLevelId || studyLevel;
      if (levelId && selectedPlan) {
        dispatch(
          actGetCoursesInStudyLevel({
            token,
            studyLevelId: levelId,
            planId: selectedPlan,
          })
        );
      }
    }
  }, [dispatch, token, editLecture, studyLevel, selectedPlan]);

  // useEffect(() => {
  //   if (success || error) {
  //     const timer = setTimeout(() => {
  //       dispatch(clearMessageUpdateLecToSchedule());
  //       dispatch(resetDeleteLecFromScheduleState());
  //     }, 4000);
  //     return () => clearTimeout(timer);
  //   }
  // });

  useEffect(() => {
    if (success || deleteSuccess || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessageUpdateLecToSchedule());
        dispatch(resetDeleteLecFromScheduleState());

        // مسح كل البيانات
        reset({
          teacher: null,
          course: null,
          startTime: "",
          endTime: "",
        });
        setStudyLevel("");
        setClassId("");
        setDate("");
        setSelectedPlan("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, deleteSuccess, dispatch, reset, error]);

  const handleEdit = (lecture) => {
    setEditLecture({
      id: lecture.id,
      scheduleId: scheduleData.id,
      studyLevelId: lecture.studyLevelId,
      startTime: lecture.startTime,
      endTime: lecture.endTime,
    });

    // reset form with current values
    reset({
      teacher: teacherNames.find((t) => t.id === lecture.teacherId) || null,
      course:
        coursesStudyLevels?.find((c) => c.id === lecture.courseId) || null,
      startTime: lecture.startTime,
      endTime: lecture.endTime,
    });

    setSelectedPlan(lecture.planId || "");
    setOpenEdit(true);
  };

  const handleEditSubmit = (data) => {
    // هنا نجهز الـ payload
    const payload = {
      id: editLecture.id,
      scheduleId: editLecture.scheduleId,
      teacherId: data.teacher?.id,
      courseId: data.course.courseId,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    // بعد ما تتأكد من صحة البيانات، نفذ الـ dispatch
    dispatch(actUpdateLecToSchedule({ data: payload, token }));
    setOpenEdit(false);
  };

  const confirmDeleteLecture = (lecture) => {
    setLectureToDelete(lecture);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    dispatch(actDeleteLecFromSchedule({ token, id: lectureToDelete.id }));

    setDeleteDialogOpen(false);
    setLectureToDelete(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Lecture updated successfully
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {loading && <CircularProgress />}

      {deleteSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Lecture deleted successfully
        </Alert>
      )}
      {deleteError && <Alert severity="error">{deleteError}</Alert>}
      {deleteLoading && <CircularProgress />}

      <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
        <CardHeader
          title="Update Lectures in Schedule"
          sx={{ textAlign: "center" }}
        />

        <CardContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Study Level</InputLabel>
            <Select
              value={studyLevel}
              onChange={(e) => setStudyLevel(e.target.value)}
            >
              {studyLevels.map((lvl) => (
                <MenuItem key={lvl.id} value={lvl.id}>
                  {lvl.level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              {classesList.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ mb: 3 }}
          />
          {classId && date && (
            <Alert
              severity={scheduleData?.id ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {scheduleData?.id
                ? `Schedule Name: ${scheduleData.name}`
                : "No schedule found for this class and date!"}
            </Alert>
          )}
          {scheduleData?.id && scheduleData?.lectures?.length === 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              This schedule has no lectures yet.
            </Alert>
          )}
          {scheduleData?.lectures?.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Lectures List
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Table sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>
                      <b>Teacher</b>
                    </TableCell>
                    <TableCell>
                      <b>Course</b>
                    </TableCell>
                    <TableCell>
                      <b>Start</b>
                    </TableCell>
                    <TableCell>
                      <b>End</b>
                    </TableCell>
                    <TableCell>
                      <b>Duration</b>
                    </TableCell>
                    <TableCell>
                      <b>Actions</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduleData.lectures.map((lec) => (
                    <TableRow key={lec.id} hover>
                      <TableCell>{lec.teacherName}</TableCell>
                      <TableCell>{lec.courseName}</TableCell>
                      <TableCell>{lec.startTime}</TableCell>
                      <TableCell>{lec.endTime}</TableCell>
                      <TableCell>{lec.duration}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(lec)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => confirmDeleteLecture(lec)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this lecture?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirmed}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Edit Lecture</DialogTitle>
        <DialogContent>
          <Controller
            name="teacher"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                onChange={(event, value) => field.onChange(value)}
                onInputChange={(event, value) => {
                  if (value.trim().length > 1) {
                    dispatch(fetchTeachersByName({ token, name: value }));
                  }
                }}
                options={teacherNames.map((t) => ({
                  label: t.name,
                  id: t.id,
                }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Teacher"
                    error={!!errors.teacher}
                    helperText={errors.teacher?.message}
                    sx={{ my: 1 }}
                  />
                )}
              />
            )}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="plan-filter-label">Plan</InputLabel>
            <Select
              labelId="plan-filter-label"
              label="Plan"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              {plans?.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Controller
            name="courseId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth sx={{ my: 1 }}>
                <InputLabel id="course-label">Course</InputLabel>
                <Select
                  {...field}
                  labelId="course-label"
                  value={field.value?.courseId || ""} // خلي القيمة id بس
                  onChange={(e) => {
                    const selectedCourse = coursesStudyLevels.find(
                      (c) => (c.id || c.courseId) === e.target.value
                    );
                    field.onChange(selectedCourse);
                  }}
                >
                  {coursesStudyLevels?.map((c) => (
                    <MenuItem key={c.courseId} value={c.courseId}>
                      {c.name || c.courseName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Time"
                type="time"
                fullWidth
                sx={{ my: 1 }}
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
              />
            )}
          />

          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="End Time"
                type="time"
                fullWidth
                sx={{ my: 1 }}
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit(handleEditSubmit)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateLecToSchedule;
