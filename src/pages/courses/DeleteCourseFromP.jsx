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
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { clearMessages } from "../../store/courses/deleteCourseFromPlan/deleteCourseFromPlanSlice";
import { actDeleteCourseFromPlan } from "../../store/courses/deleteCourseFromPlan/actDeleteCourseFromPlan";

// ✅ Validation schema
const schema = yup.object({
  planId: yup.string().required("Plan is required"),
  courseId: yup.string().required("Course is required"),
});

const DeleteCourseFromP = ({ courseDataForDelete, onClose }) => {
  console.log("courseDataForDelete:", courseDataForDelete);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      planId: "",
      courseId: "",
    },
  });

  const plans = useSelector((state) => state.plansId.list);
  const deleteState = useSelector((state) => state.deleteCourseFromPlan);

  // fetch plans on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchPlans(token));
    }
  }, [dispatch, token]);

  // ✅ ملء بيانات الكورس عند توفرها
  useEffect(() => {
    if (courseDataForDelete) {
      setValue(
        "courseId",
        String(courseDataForDelete.courseId || courseDataForDelete.id || "")
      );
    }
  }, [courseDataForDelete, setValue]);

  // watch selected plan
  const selectedPlanId = watch("planId");

  // clear course when plan changes
  useEffect(() => {
    if (selectedPlanId && courseDataForDelete) {
      // إذا تغيرت الخطة، لكن نحتفظ بالكورس المحدد مسبقاً
      // يمكنك تعديل هذا السلوك حسب المطلوب
      console.log("Plan changed to:", selectedPlanId);
    }
  }, [selectedPlanId, courseDataForDelete]);

  // clear messages after 3 sec
  useEffect(() => {
    if (deleteState.successMessage || deleteState.errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
        if (deleteState.successMessage) {
          onClose(); // أغلق الـ Dialog عند نجاح العملية
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteState.successMessage, deleteState.errorMessage, dispatch, onClose]);

  const onSubmit = (data) => {
    dispatch(
      actDeleteCourseFromPlan({
        courseId: Number(data.courseId),
        planId: Number(data.planId),
        token,
      })
    );
  };

  const coursesForDisplay = courseDataForDelete
    ? [
        {
          courseId: courseDataForDelete.courseId || courseDataForDelete.id,
          courseName:
            courseDataForDelete.courseName || courseDataForDelete.name,
        },
      ]
    : [];

  // ✅ تحضير قائمة الخطط المتاحة للكورس
  const availablePlans = courseDataForDelete?.plans || plans || [];

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Delete Course from Plan</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {deleteState.successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {deleteState.successMessage}
          </Alert>
        )}
        {deleteState.errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {deleteState.errorMessage}
          </Alert>
        )}

        {courseDataForDelete && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You are about to delete:{" "}
            <strong>
              {courseDataForDelete.courseName || courseDataForDelete.name}
            </strong>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} id="delete-course-form">
          {/* ✅ Course Selection - مُحدد مسبقاً */}
          <FormControl fullWidth margin="normal" error={!!errors.courseId}>
            <InputLabel>Course</InputLabel>
            <Controller
              name="courseId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Course"
                  disabled // مُحدد مسبقاً ولا يمكن تغييره
                  renderValue={(selected) => {
                    const course = coursesForDisplay.find(
                      (c) => String(c.courseId) === String(selected)
                    );
                    return course ? course.courseName : "No course selected";
                  }}
                >
                  {coursesForDisplay.map((course) => (
                    <MenuItem
                      key={course.courseId}
                      value={String(course.courseId)}
                    >
                      {course.courseName}
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

          {/* Plan Selection */}
          <FormControl fullWidth margin="normal" error={!!errors.planId}>
            <InputLabel>Choose Plan to Remove From</InputLabel>
            <Controller
              name="planId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Choose Plan to Remove From">
                  {availablePlans.length ? (
                    availablePlans.map((plan) => (
                      <MenuItem key={plan.id} value={String(plan.id)}>
                        {plan.name || `Plan ${plan.id}`}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No plans found</MenuItem>
                  )}
                </Select>
              )}
            />
            {errors.planId && (
              <Typography color="error" variant="caption">
                {errors.planId.message}
              </Typography>
            )}
          </FormControl>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          type="submit"
          form="delete-course-form"
          disabled={deleteState.loading}
        >
          {deleteState.loading ? "Deleting..." : "Delete Course from Plan"}
        </Button>
      </DialogActions>
    </>
  );
};

export default DeleteCourseFromP;
