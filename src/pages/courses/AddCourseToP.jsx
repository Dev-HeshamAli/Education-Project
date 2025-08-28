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
import { actAddCourseToPlan } from "../../store/courses/addCourseToPlan/actAddCourseToPlan";
import { clearMessages } from "../../store/courses/addCourseToPlan/addCourseToPlanSlice";

// ✅ Validation schema - مبسط أكتر لأن الكورس محدد مسبقاً
const schema = yup.object({
  courseId: yup.string().required("Course is required"),
  targetPlanId: yup.string().required("Target Plan is required"),
});

const AddCourseToP = ({ courseDataForAdd, onClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const addCourseState = useSelector((state) => state.addCourseToPlan);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      courseId: "",
      targetPlanId: "",
    },
  });

  // Redux data
  const plans = useSelector((state) => state.plansId.list);

  // Fetch plans
  useEffect(() => {
    if (token) {
      dispatch(fetchPlans(token));
    }
  }, [dispatch, token]);

  // ✅ ملء بيانات الكورس عند توفرها
  useEffect(() => {
    if (courseDataForAdd) {
      console.log("Setting course data for add:", courseDataForAdd);
      setValue(
        "courseId",
        String(courseDataForAdd.courseId || courseDataForAdd.id || "")
      );
    }
  }, [courseDataForAdd, setValue]);

  // clear messages and close dialog on success
  useEffect(() => {
    if (addCourseState.successMessage || addCourseState.errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
        if (addCourseState.successMessage) {
          onClose(); // أغلق الـ Dialog عند نجاح العملية
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [
    addCourseState.successMessage,
    addCourseState.errorMessage,
    dispatch,
    onClose,
  ]);

  const onSubmit = (data) => {
    console.log("Submitting add request:", data);
    dispatch(
      actAddCourseToPlan({
        courseId: Number(data.courseId),
        planId: Number(data.targetPlanId),
        token,
      })
    );
  };

  // ✅ تحضير قائمة الكورسات للعرض
  const coursesForDisplay = courseDataForAdd
    ? [
        {
          courseId: courseDataForAdd.courseId || courseDataForAdd.id,
          courseName: courseDataForAdd.courseName || courseDataForAdd.name,
        },
      ]
    : [];

  // ✅ فلترة الخطط - استبعاد الخطط اللي الكورس موجود فيها بالفعل
  const availablePlans =
    plans?.filter((plan) => {
      // إذا كان عندنا معلومات عن الخطط الحالية للكورس
      if (courseDataForAdd?.plans?.length) {
        // استبعد الخطط اللي الكورس موجود فيها بالفعل
        return !courseDataForAdd.plans.some(
          (existingPlan) => existingPlan.id === plan.id
        );
      }
      return true; // إذا مفيش معلومات، اظهر كل الخطط
    }) || [];

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Course to Plan</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {addCourseState.successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {addCourseState.successMessage}
          </Alert>
        )}
        {addCourseState.errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {addCourseState.errorMessage}
          </Alert>
        )}

        {courseDataForAdd && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You are about to add:{" "}
            <strong>
              {courseDataForAdd.courseName || courseDataForAdd.name}
            </strong>
          </Alert>
        )}

        {availablePlans.length === 0 && courseDataForAdd?.plans?.length && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This course is already added to all available plans.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} id="add-course-form">
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

          {/* Target Plan Selection */}
          <FormControl fullWidth margin="normal" error={!!errors.targetPlanId}>
            <InputLabel>Choose Target Plan</InputLabel>
            <Controller
              name="targetPlanId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Choose Target Plan">
                  {availablePlans.length ? (
                    availablePlans.map((plan) => (
                      <MenuItem key={plan.id} value={String(plan.id)}>
                        {plan.name || `Plan ${plan.id}`}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {courseDataForAdd?.plans?.length
                        ? "Course already in all plans"
                        : "No plans available"}
                    </MenuItem>
                  )}
                </Select>
              )}
            />
            {errors.targetPlanId && (
              <Typography color="error" variant="caption">
                {errors.targetPlanId.message}
              </Typography>
            )}
          </FormControl>

          {/* معلومات إضافية عن الكورس */}
          {courseDataForAdd?.plans?.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Plans:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {courseDataForAdd.plans.map((plan) => plan.name).join(", ")}
              </Typography>
            </Box>
          )}
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          form="add-course-form"
          disabled={addCourseState.loading || availablePlans.length === 0}
        >
          {addCourseState.loading ? "Adding..." : "Add Course to Plan"}
        </Button>
      </DialogActions>
    </>
  );
};

export default AddCourseToP;
