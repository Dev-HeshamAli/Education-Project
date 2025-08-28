import { useDispatch, useSelector } from "react-redux";
import { actanyCourseNameLevel } from "../../../store/shared/anyCourseName/actanyCourseNameLevel";
import { useEffect, useState } from "react";
import { fetchPlans } from "../../../store/shared/plan/actGetPlan";
import {
  Box,
  Button,
  Typography,
  Container,
  Autocomplete,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@mui/material";
import * as yup from "yup";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchTeachersByName } from "../../../store/shared/teacherByName/actGetTeacherByName";
import { fetchSemesters } from "../../../store/shared/semesters/actGetSemesters";
import { fetchStudyLevels } from "../../../store/shared/studyLevel/actGetStudyLevels";
import { actUpdateLecToSchedule } from "../../../store/schedule/updateLecToSchedule/actUpdateLecToSchedule";
import { clearMessageUpdateLecToSchedule } from "../../../store/schedule/updateLecToSchedule/updateLecToScheduleSlice";

const schema = yup.object().shape({
  teacher: yup.object().required("Please select a teacher"),
  course: yup.object().required("Please select a course"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
});

const UpdateLec = ({
  endTime,
  startTime,
  scheduleDayesIdForUpdate,
  courseName,
  teacherName,
  id,
}) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const coursesStudyLevels = useSelector((state) => state.anyCourseName.list);
  const studyLevels = useSelector((state) => state.studyLevelsId?.list || []);
  const semesters = useSelector((state) => state.semestersId.list);
  const teacherNames = useSelector((state) => state.teacherByName?.list || []);
  const plans = useSelector((state) => state.plansId.list);
  const { error, success } = useSelector((state) => state.updateLecToSchedule);

  // الحصول على القيم من Redux store
  const { studyLevelId, semesterId } = useSelector(
    (state) => state.selectionIds
  );

  // State للحقول المختارة
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedStudyLevel, setSelectedStudyLevel] = useState(
    studyLevelId || ""
  );
  const [selectedSemester, setSelectedSemester] = useState(semesterId || "");

  // إضافة state للتحكم في البحث عن المدرس
  const [teacherInputValue, setTeacherInputValue] = useState("");
  const [teacherSearchTimeout, setTeacherSearchTimeout] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      teacher: null,
      course: null,
      startTime: startTime || "",
      endTime: endTime || "",
    },
  });

  // مراقبة قيمة المدرس المختار
  const selectedTeacher = watch("teacher");

  // جلب البيانات الأساسية
  useEffect(() => {
    dispatch(fetchPlans(token));
    dispatch(fetchSemesters(token));
    dispatch(fetchStudyLevels(token));
  }, [dispatch, token]);

  // تحديد القيمة الافتراضية للـ plan (Online School)
  useEffect(() => {
    if (plans && plans.length > 0) {
      const onlineSchoolPlan = plans.find((plan) =>
        plan.name.toLowerCase().includes("online school")
      );

      if (onlineSchoolPlan) {
        setSelectedPlan(onlineSchoolPlan.id);
      } else {
        setSelectedPlan(plans[0]?.id || "");
      }
    }
  }, [plans]);

  // جلب الكورسات عند تغيير المعايير
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

  // البحث الأولي عن المدرس عند تحميل الكومبوننت
  useEffect(() => {
    if (teacherName) {
      // جلب بيانات المدرس بناءً على الاسم
      dispatch(fetchTeachersByName({ token, name: teacherName }));
      // تعيين قيمة البحث في الحقل
      setTeacherInputValue(teacherName);
    }
  }, [teacherName, dispatch, token]);

  // تعيين المدرس المطابق عند وصول البيانات
  useEffect(() => {
    if (teacherName && teacherNames.length > 0 && !selectedTeacher) {
      const matchedTeacher = teacherNames.find((teacher) => {
        const teacherNameLower = teacher.name?.toLowerCase() || "";
        const searchNameLower = teacherName.toLowerCase();
        return (
          teacherNameLower.includes(searchNameLower) ||
          searchNameLower.includes(teacherNameLower)
        );
      });

      if (matchedTeacher) {
        setValue("teacher", matchedTeacher);
        setTeacherInputValue(matchedTeacher.name);
      }
    }
  }, [teacherNames, teacherName, selectedTeacher, setValue]);

  // البحث عن الكورس بالاسم وتحديده كقيمة افتراضية
  useEffect(() => {
    if (courseName && coursesStudyLevels && coursesStudyLevels.length > 0) {
      const matchedCourse = coursesStudyLevels.find((course) => {
        const courseNameToCheck = course.name || course.courseName || "";
        return (
          courseNameToCheck.toLowerCase().includes(courseName.toLowerCase()) ||
          courseName.toLowerCase().includes(courseNameToCheck.toLowerCase())
        );
      });

      if (matchedCourse) {
        setValue("course", matchedCourse);
      }
    }
  }, [courseName, coursesStudyLevels, setValue]);

  // تحديث أوقات البداية والنهاية من الـ props
  useEffect(() => {
    if (startTime) {
      setValue("startTime", startTime);
    }
    if (endTime) {
      setValue("endTime", endTime);
    }
  }, [startTime, endTime, setValue]);

  // دالة البحث عن المدرسين مع debounce
  const handleTeacherSearch = (searchValue) => {
    // مسح الـ timeout السابق
    if (teacherSearchTimeout) {
      clearTimeout(teacherSearchTimeout);
    }

    // إنشاء timeout جديد للبحث
    const newTimeout = setTimeout(() => {
      if (searchValue && searchValue.length >= 2) {
        dispatch(fetchTeachersByName({ token, name: searchValue }));
      }
    }, 300); // انتظار 300ms قبل البحث

    setTeacherSearchTimeout(newTimeout);
  };

  const onSubmit = (data) => {
    const finalData = {
      id: id || 0,
      scheduleDayesId: scheduleDayesIdForUpdate || 0,
      teacherId: data.teacher?.id || 0,
      courseId: data.course?.id || data.course?.courseId || 0,
      startTime: data.startTime,
      endTime: data.endTime,
    };
    dispatch(actUpdateLecToSchedule({ data: finalData, token }));
  };

  // تنظيف الـ timeout عند إلغاء تحميل الكومبوننت
  useEffect(() => {
    return () => {
      if (teacherSearchTimeout) {
        clearTimeout(teacherSearchTimeout);
      }
    };
  }, [teacherSearchTimeout]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessageUpdateLecToSchedule());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, error]);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardHeader sx={{ textAlign: "center" }} title="Update Lecture" />
        <Table>
          <TableBody>
            {/* Plan */}
            <TableRow>
              <TableCell width="30%">Plan</TableCell>
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
              <TableCell>Study Level</TableCell>
              <TableCell>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="study-level-label">Study Level</InputLabel>
                  <Select
                    labelId="study-level-label"
                    label="Study Level"
                    value={selectedStudyLevel}
                    onChange={(e) => setSelectedStudyLevel(e.target.value)}
                  >
                    {studyLevels.map((level) => (
                      <MenuItem key={level.id} value={level.id}>
                        {level.level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>

            {/* Semester */}
            <TableRow>
              <TableCell>Semester</TableCell>
              <TableCell>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="semester-label">Semester</InputLabel>
                  <Select
                    labelId="semester-label"
                    label="Semester"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                  >
                    {semesters?.map((semester) => (
                      <MenuItem key={semester.id} value={semester.id}>
                        {semester.name}
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
                <Controller
                  name="course"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={coursesStudyLevels || []}
                      getOptionLabel={(option) =>
                        option.name || option.courseName || ""
                      }
                      getOptionKey={(option) => option.id || option.courseId}
                      isOptionEqualToValue={(option, value) =>
                        (option.id || option.courseId) ===
                        (value?.id || value?.courseId)
                      }
                      onChange={(e, value) => {
                        field.onChange(value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Course"
                          error={!!errors.course}
                          helperText={errors.course?.message}
                          margin="normal"
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          key={option.id || option.courseId}
                        >
                          {option.name || option.courseName}
                        </Box>
                      )}
                    />
                  )}
                />
              </TableCell>
            </TableRow>

            {/* Teacher - محسّن */}
            <TableRow>
              <TableCell>Teacher</TableCell>
              <TableCell>
                <Controller
                  name="teacher"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      value={value}
                      inputValue={teacherInputValue}
                      options={teacherNames || []}
                      getOptionLabel={(option) => option?.name || ""}
                      getOptionKey={(option) => option?.id}
                      isOptionEqualToValue={(option, value) =>
                        option?.id === value?.id
                      }
                      onInputChange={(event, newInputValue, reason) => {
                        setTeacherInputValue(newInputValue);

                        // البحث عن المدرسين عند الكتابة
                        if (reason === "input") {
                          handleTeacherSearch(newInputValue);
                        }
                      }}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                        if (newValue) {
                          setTeacherInputValue(newValue.name);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search by Teacher Name"
                          error={!!errors.teacher}
                          helperText={errors.teacher?.message}
                          margin="normal"
                          placeholder="Type teacher name..."
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                          {option.name}
                        </Box>
                      )}
                      filterOptions={(options) => {
                        // عرض كل النتائج من الـ API دون فلترة إضافية
                        return options;
                      }}
                      freeSolo={false}
                      selectOnFocus
                      clearOnBlur={false}
                      handleHomeEndKeys
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
                      margin="normal"
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
                      margin="normal"
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

        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit(onSubmit)}
            sx={{ py: 1.2, fontSize: "16px" }}
          >
            Update Lecture
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default UpdateLec;
