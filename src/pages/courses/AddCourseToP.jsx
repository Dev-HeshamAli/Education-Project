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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchCoursesStudyLevels } from "../../store/shared/coursesStudyLevel/actGetCoursesStudyLevel";
import { actAddCourseToPlan } from "../../store/courses/addCourseToPlan/actAddCourseToPlan";
import { clearMessages } from "../../store/courses/addCourseToPlan/addCourseToPlanSlice";

// ✅ Validation schema
const schema = yup.object({
  planId: yup.string().required("Plan is required"),
  courseId: yup.string().required("Course is required"),
});

const AddCourseToP = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const addCourseState = useSelector((state) => state.addCourseToPlan);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      planId: "",
      courseId: "",
    },
  });

  const plans = useSelector((state) => state.plansId.list);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const courses = useSelector((state) => state.coursesStudyLevelsId.list);

  // Fetch plans
  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  // Fetch study levels
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  // Fetch courses for the first study level
  useEffect(() => {
    if (token && studyLevels.length > 0) {
      const firstStudyLevelId = studyLevels[0].id;
      dispatch(fetchCoursesStudyLevels({ token, id: firstStudyLevelId }));
    }
  }, [dispatch, token, studyLevels]);

  const onSubmit = (data) => {
    console.log("✅ Selected Plan ID:", data.planId);
    console.log("✅ Selected Course ID:", data.courseId);
    dispatch(
      actAddCourseToPlan({
        courseId: data.courseId,
        planId: data.planId,
        token,
      })
    );
  };

  useEffect(() => {
    if (addCourseState.successMessage || addCourseState.errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [addCourseState.successMessage, addCourseState.errorMessage, dispatch]);

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Add Course to Plan
      </Typography>

      {addCourseState.successMessage && (
        <Typography color="success.main" mt={2}>
          {addCourseState.successMessage}
        </Typography>
      )}

      {addCourseState.errorMessage && (
        <Typography color="error.main" mt={2}>
          {addCourseState.errorMessage}
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Plan Select */}
        <FormControl fullWidth margin="normal" error={!!errors.planId}>
          <InputLabel>Choose Plan</InputLabel>
          <Controller
            name="planId"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Choose Plan">
                {plans?.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name || `Plan ${plan.id}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.planId && (
            <Typography color="error" variant="caption">
              {errors.planId.message}
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
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
        >
          Add Course to Plan
        </Button>
      </form>
    </Box>
  );
};

export default AddCourseToP;
