import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
import { actAddLecToSchedule } from "../../store/schedule/addLecToSchedule/actAddLecToSchedule";
import { clearMessageaddLecToSchedule } from "../../store/schedule/addLecToSchedule/addLecToScheduleSlice";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
import { actanyCourseNameLevel } from "../../store/shared/anyCourseName/actanyCourseNameLevel";

const schema = yup.object().shape({
  studyLevel: yup.string().required("Study Level is required"),
  teacher: yup.object().nullable().required("Teacher is required"),
  courseId: yup.string().required("Course is required"),
  startTime: yup.string().required("Start Time is required"),
  endTime: yup.string().required("End Time is required"),
});

const AddLecToSchedule = ({
  scheduleDayesId,
  semesterId,
  studyLevelId,
}) => {

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const studyLevels = useSelector((state) => state.studyLevelsId?.list || []);
  const teacherNames = useSelector((state) => state.teacherByName?.list || []);
  const plans = useSelector((state) => state.plansId.list);
  const semesters = useSelector((state) => state.semestersId.list);

  // استخدام البيانات من الـ props كقيم افتراضية
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedSemester, setselectedSemester] = useState(semesterId || "");

  const { error, loading, success } = useSelector(
    (state) => state.addLecToSchedule
  );
  const coursesStudyLevels = useSelector((state) => state.anyCourseName.list);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studyLevel: studyLevelId || "",
      teacher: null,
      courseId: "",
      startTime: "",
      endTime: "",
    },
  });

  const selectedStudyLevel = watch("studyLevel");

  // تحديد القيمة الافتراضية للـ plan عند تحميل البيانات
  useEffect(() => {
    if (plans && plans.length > 0) {
      // البحث عن "online school" أولاً
      const onlineSchoolPlan = plans.find((plan) =>
        plan.name.toLowerCase().includes("online school")
      );

      if (onlineSchoolPlan) {
        setSelectedPlan(onlineSchoolPlan.id);
      } else {
        // إذا لم يوجد "online school"، اختر أول plan
        setSelectedPlan(plans[0].id);
      }
    }
  }, [plans]);

  // تحديد القيمة الافتراضية للـ semester من الـ props
  useEffect(() => {
    if (semesterId) {
      setselectedSemester(semesterId);
    }
  }, [semesterId]);

  // تحديد القيمة الافتراضية للـ study level من الـ props
  useEffect(() => {
    if (studyLevelId) {
      setValue("studyLevel", studyLevelId);
    }
  }, [studyLevelId, setValue]);

  useEffect(() => {
    dispatch(fetchPlans(token));
    dispatch(fetchStudyLevels(token));
    dispatch(fetchSemesters(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (selectedStudyLevel && selectedPlan && selectedSemester) {
      dispatch(
        actanyCourseNameLevel({
          token,
          studyLevelId: selectedStudyLevel,
          planId: selectedPlan,
          semesterId: selectedSemester,
        })
      );
    }
  }, [dispatch, token, selectedStudyLevel, selectedPlan, selectedSemester]);

  // إحذف reset() من onSubmit
  const onSubmit = (data) => {
    const finalData = {
      scheduleDayesId: scheduleDayesId,
      teacherId: data.teacher.id,
      courseId: +data.courseId,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    dispatch(actAddLecToSchedule({ data: finalData, token }));
  };

  useEffect(() => {
    if (success) {
      reset({
        studyLevel: studyLevelId || "",
        teacher: null,
        courseId: "",
        startTime: "",
        endTime: "",
      });
      setselectedSemester(semesterId || "");
      // إعادة تحديد القيمة الافتراضية للـ plan
      if (plans && plans.length > 0) {
        const onlineSchoolPlan = plans.find((plan) =>
          plan.name.toLowerCase().includes("online school")
        );
        setSelectedPlan(onlineSchoolPlan ? onlineSchoolPlan.id : plans[0].id);
      }
    }
  }, [success, reset, studyLevelId, semesterId, plans]);

  useEffect(() => {
    let timeoutId;
    if (success || error) {
      timeoutId = setTimeout(() => {
        dispatch(clearMessageaddLecToSchedule());
      }, 4000);
    }

    return () => clearTimeout(timeoutId);
  }, [success, error, dispatch]);

  return (
    <Box>
      {error && (
        <Alert sx={{ m: 2 }} severity="error">
          {error}
        </Alert>
      )}
      {success && (
        <Alert sx={{ m: 2 }} severity="success">
          {success}
        </Alert>
      )}
      {loading && (
        <Alert sx={{ m: 2 }} severity="info">
          Loading...
        </Alert>
      )}
      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardHeader
          sx={{ textAlign: "center" }}
          title="Add Lecture to Schedule"
        />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Plan</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
            {/* Study Level */}
            <TableRow>
              <TableCell width="30%">Study Level</TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <InputLabel>Study Level</InputLabel>
                  <Controller
                    name="studyLevel"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Study Level">
                        {studyLevels.map((lvl) => (
                          <MenuItem key={lvl.id} value={lvl.id}>
                            {lvl.level}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
                {errors.studyLevel && (
                  <Typography color="error">
                    {errors.studyLevel.message}
                  </Typography>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Semester</TableCell>
              <TableCell>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="Semester-filter-label">Semester</InputLabel>
                  <Select
                    labelId="Semester-filter-label"
                    label="Semester"
                    value={selectedSemester}
                    onChange={(e) => setselectedSemester(e.target.value)}
                  >
                    {semesters?.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>

            {/* Course */}
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="course-select-label">Course</InputLabel>
                  <Controller
                    name="courseId"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select {...field} label="Course">
                        {coursesStudyLevels && coursesStudyLevels.length > 0 ? (
                          coursesStudyLevels.map((c) => (
                            <MenuItem
                              key={c.id || c.courseId}
                              value={c.id || c.courseId}
                            >
                              {c.name || c.courseName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No courses available</MenuItem>
                        )}
                      </Select>
                    )}
                  />
                </FormControl>
                {errors.courseId && (
                  <Typography color="error">
                    {errors.courseId.message}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
            {/* Teacher */}
            <TableRow>
              <TableCell>Teacher</TableCell>
              <TableCell>
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
                          error={!!errors.teacher}
                          helperText={errors.teacher?.message}
                        />
                      )}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
            {/* Start Time */}
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="time"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.startTime}
                      helperText={errors.startTime?.message}
                    />
                  )}
                />
              </TableCell>
            </TableRow>

            {/* End Time */}
            <TableRow>
              <TableCell>End Time</TableCell>
              <TableCell>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="time"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.endTime}
                      helperText={errors.endTime?.message}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Divider sx={{ my: 3 }} />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit(onSubmit)}
          sx={{ py: 1.2, fontSize: "16px" }}
        >
          Add Lecture
        </Button>
      </Card>
    </Box>
  );
};

export default AddLecToSchedule;
