import { useEffect } from "react";
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchCoursesStudyLevels } from "../../store/shared/coursesStudyLevel/actGetCoursesStudyLevel";
import { fetchTeachersByStudyLevel } from "../../store/shared/teacherByStudyLevel/actGetTeacherByStudyLevel";
import { actAddTeacherToCourse } from "../../store/addTeacherToCourse/actAddTeacherToCourse";
import { clearMessageAddTeacherToCourse } from "../../store/addTeacherToCourse/addTeacherToCourseSlice";
import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
const schema = yup.object().shape({
  studyLevel: yup.string().required("Study level is required"),
  teacherId: yup.string().required("Teacher is required"),
  courseId: yup.string().required("Course is required"),
});

const AddTeacherToCourse = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { loading, success, error } = useSelector(
    (state) => state.addTeacherToCourse
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studyLevel: "",
      teacherId: "",
      courseId: "",
      name: null,
    },
  });

  const selectedStudyLevel = watch("studyLevel");

  // Fetch study levels on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  const studyLevels = useSelector((state) => state.studyLevelsId.list);

  // Fetch teachers and courses when study level is selected
  useEffect(() => {
    if (selectedStudyLevel && token) {
      dispatch(fetchCoursesStudyLevels({ token, id: selectedStudyLevel }));
      dispatch(fetchTeachersByStudyLevel({ token, id: selectedStudyLevel }));
    }
  }, [selectedStudyLevel, dispatch, token]);

  // const teachers = useSelector((state) => state.teacherByStudyLevel.list);
  const courses = useSelector((state) => state.coursesStudyLevelsId.list);
  const teacherNames = useSelector((state) => state.teacherByName?.list || []);

  const onSubmit = (data) => {
    dispatch(
      actAddTeacherToCourse({
        teacherId: data.teacherId,
        courseId: data.courseId,
        token,
      })
    );
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessageAddTeacherToCourse());
        reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch, reset]);

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        Assign Teacher to Course
      </Typography>

      {loading && (
        <Alert sx={{ my: 2 }} severity="info">
          {loading}
        </Alert>
      )}
      {success && (
        <Alert sx={{ my: 2 }} severity="success">
          {success}
        </Alert>
      )}
      {error && (
        <Alert sx={{ my: 2 }} severity="error">
          {error}
        </Alert>
      )}

      {/* select teacher BY study level*/}
      {/* Select Teacher */}
      {/* <Controller
        name="teacherId"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.teacherId}>
            <InputLabel>Teacher</InputLabel>
            <Select {...field} label="Teacher">
              {teachers?.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      /> */}

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Autocomplete
            options={teacherNames}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            onInputChange={(e, value) => {
              if (value && value.length >= 2) {
                dispatch(fetchTeachersByName({ token, name: value }));
              }
            }}
            value={field.value || null}
            onChange={(e, value) => {
              field.onChange(value); // store whole object in `name`
              setValue("teacherId", value?.id || ""); // store id in `teacherId`
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by Name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                {option.name}
              </Box>
            )}
          />
        )}
      />

      {/* Select Study Level */}
      <Controller
        name="studyLevel"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.studyLevel}>
            <InputLabel>Study Level</InputLabel>
            <Select {...field} label="Study Level">
              <MenuItem value="">Select a study level</MenuItem>
              {studyLevels?.map((level) => (
                <MenuItem key={level.id} value={level.id}>
                  {level.level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {/* Select Course */}
      {/* <Controller
        name="courseId"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.courseId}>
            <InputLabel>Course</InputLabel>
            <Select {...field} label="Course">
              {courses?.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      /> */}

      <Controller
        name="courseId"
        control={control}
        render={({ field }) => {
          const validCourseIds = courses.map((c) => String(c.id)); // خليها كلها سترينج لو لازم
          const currentValue = validCourseIds.includes(String(field.value))
            ? field.value
            : "";

          return (
            <FormControl fullWidth error={!!errors.courseId}>
              <InputLabel>Course</InputLabel>
              <Select {...field} value={currentValue} label="Course">
                <MenuItem value="">Select a course</MenuItem>
                {courses?.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }}
      />

      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Box>
  );
};

export default AddTeacherToCourse;
