import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Alert from "@mui/material/Alert";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchCoursesStudyLevels } from "../../store/shared/coursesStudyLevel/actGetCoursesStudyLevel";
import { actAddCourseToAcademicYear } from "../../store/courses/addCourseToAY/actaddCourseToAcademicYear";
import { clearMessages } from "../../store/courses/addCourseToAY/addCourseToAcademicYearSlice";

// ✅ Schema for validation
const schema = yup.object({
  academicYearId: yup.string().required("Academic Year is required"),
  courseId: yup.string().required("Course is required"),
  studyLevelId: yup.string().required("Study Level is required"),
  
});

const DeleteCourseFromAY = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const addAYState = useSelector((state) => state.addCourseToAcademicYear);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      academicYearId: "",
      courseId: "",
      studyLevelId: "",
    },
  });

  const academicYears = useSelector((state) => state.academicYearsId.list);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const courses = useSelector((state) => state.coursesStudyLevelsId.list);

  // Fetch academic years on mount
  useEffect(() => {
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  // Fetch study levels
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  // Fetch courses from first study level
  useEffect(() => {
    if (token && studyLevels.length > 0) {
      const firstStudyLevelId = studyLevels[0].id;
      dispatch(fetchCoursesStudyLevels({ token, id: firstStudyLevelId }));
    }
  }, [dispatch, token, studyLevels]);

  useEffect(() => {
    if (addAYState.successMessage || addAYState.errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addAYState.successMessage, addAYState.errorMessage, dispatch]);

  const onSubmit = (data) => {
    dispatch(
      actAddCourseToAcademicYear({
        courseId: data.courseId,
        academicYearId: data.academicYearId,
        token,
      })
    );
    // Reset form after submission
    reset();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Add Course To Academic Year
      </Typography>

      {addAYState.successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {addAYState.successMessage}
        </Alert>
      )}

      {addAYState.errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {addAYState.errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Academic Year Select */}
        <FormControl fullWidth margin="normal" error={!!errors.academicYearId}>
          <InputLabel>Choose Academic Year</InputLabel>
          <Controller
            name="academicYearId"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Choose Academic Year">
                {academicYears?.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.date || `Year ${year.id}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.academicYearId && (
            <Typography color="error" variant="caption">
              {errors.academicYearId.message}
            </Typography>
          )}
        </FormControl>

        {/* Study Level Select */}
        <FormControl fullWidth margin="normal" error={!!errors.studyLevelId}>
          <InputLabel>Choose Study Level</InputLabel>
          <Controller
            name="studyLevelId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Choose Study Level"
                onChange={(e) => {
                  const selectedLevelId = e.target.value;
                  field.onChange(selectedLevelId); // Update form state
                  dispatch(
                    fetchCoursesStudyLevels({ token, id: selectedLevelId })
                  ); // Fetch courses for selected level
                }}
              >
                {studyLevels?.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.level || `Level ${level.id}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.studyLevelId && (
            <Typography color="error" variant="caption">
              {errors.studyLevelId.message}
            </Typography>
          )}
        </FormControl>

        {/* Course Select */}
        <FormControl fullWidth margin="normal" error={!!errors.courseId}>
          <InputLabel>Choose Course</InputLabel>
          <Controller
            name="courseId"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Choose Course">
                {courses?.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name || `Course ${course.id}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.courseId && (
            <Typography color="error" variant="caption">
              {errors.courseId.message}
            </Typography>
          )}
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Course to Academic Year
        </Button>
      </form>
    </Box>
  );
};

export default DeleteCourseFromAY;
