import { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoursesStudyLevels } from "../../store/shared/coursesStudyLevel/actGetCoursesStudyLevel";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { fetchStages } from "../../store/shared/stage/actGetStage";
import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
import { actUpdateCourse } from "../../store/courses/updateCourse/actUpdateCourse";
import { clearUpdateMessages } from "../../store/courses/updateCourse/updateCourseSlice";

// ✅ Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Course name is required"),
  description: yup.string().required("Description is required"),
  stageId: yup.string().required("Stage is required"),
  semesterId: yup.string().required("Semester is required"),
  planId: yup.string().required("Plan is required"),
});

const UpdateCourse = () => {
  const dispatch = useDispatch();
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const plans = useSelector((state) => state.plansId.list);
  const stages = useSelector((state) => state.stageId.list);
  const semesters = useSelector((state) => state.semestersId.list);
  const coursesStudyLevels = useSelector(
    (state) => state.coursesStudyLevelsId.list
  );
  const updateState = useSelector((state) => state.updateCourse);

  const token = localStorage.getItem("token");

  const [selectedStudyLevel, setSelectedStudyLevel] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "",
      stageId: "",
      semesterId: "",
      planId: "",
    },
  });

  // Fetch base data
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
      dispatch(fetchPlans(token));
      dispatch(fetchStages(token));
      dispatch(fetchSemesters(token));
    }
  }, [dispatch, token]);

  // Fetch courses when study level changes
  useEffect(() => {
    if (selectedStudyLevel) {
      dispatch(fetchCoursesStudyLevels({ token, id: selectedStudyLevel }));
    }
  }, [selectedStudyLevel, dispatch, token]);

  // Update selected course and populate form
  useEffect(() => {
    if (selectedCourseId && coursesStudyLevels.length > 0) {
      const course = coursesStudyLevels.find(
        (item) => item.id === +selectedCourseId
      );
      if (course) {
        setSelectedCourse(course);
        reset({
          name: course.name || "",
          description: course.description || "",
          stageId: course.stageId?.toString() || "",
          semesterId: course.semesterId?.toString() || "",
          planId: course.planId?.toString() || "",
        });
      }
    }
  }, [selectedCourseId, coursesStudyLevels, reset]);

  useEffect(() => {
    if (updateState.successMessage || updateState.errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearUpdateMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateState.successMessage, updateState.errorMessage, dispatch]);

  const onSubmit = (data) => {
    const fullData = {
      id: selectedCourse?.id,
      name: data.name,
      description: data.description,
      stageId: +data.stageId,
      semesterId: +data.semesterId,
      planId: +data.planId,
      studyLevelId: +selectedStudyLevel,
    };

    dispatch(actUpdateCourse({ data: fullData, token }));
    reset();
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Update Course
      </Typography>

      {updateState.successMessage && (
        <Typography
          color="success.main"
          sx={{ fontWeight: "bold", textAlign: "center", mt: 2 }}
        >
          {updateState.successMessage}
        </Typography>
      )}

      {updateState.errorMessage && (
        <Typography
          color="error.main"
          sx={{ fontWeight: "bold", textAlign: "center", mt: 2 }}
        >
          {updateState.errorMessage}
        </Typography>
      )}

      {/* Study Level Select */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Study Level</InputLabel>
        <Select
          value={selectedStudyLevel}
          onChange={(e) => {
            setSelectedStudyLevel(e.target.value);
            setSelectedCourse(null);
            setSelectedCourseId("");
          }}
          label="Study Level"
        >
          {studyLevels?.map((level) => (
            <MenuItem key={level.id} value={level.id}>
              {level.level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Course Select */}
      {selectedStudyLevel && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            label="Select Course"
          >
            {coursesStudyLevels?.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Form to update course details */}
      {selectedCourse && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Course Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Description"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
            margin="normal"
          />

          {/* Stage Select */}
          <FormControl fullWidth margin="normal" error={!!errors.stageId}>
            <InputLabel>Stage</InputLabel>
            <Controller
              name="stageId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Stage">
                  {stages.map((stage) => (
                    <MenuItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.stageId && (
              <Typography color="error" variant="body2">
                {errors.stageId.message}
              </Typography>
            )}
          </FormControl>

          {/* Semester Select */}
          <FormControl fullWidth margin="normal" error={!!errors.semesterId}>
            <InputLabel>Semester</InputLabel>
            <Controller
              name="semesterId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Semester">
                  {semesters.map((semester) => (
                    <MenuItem key={semester.id} value={semester.id}>
                      {semester.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.semesterId && (
              <Typography color="error" variant="body2">
                {errors.semesterId.message}
              </Typography>
            )}
          </FormControl>

          {/* Plan Select */}
          <FormControl fullWidth margin="normal" error={!!errors.planId}>
            <InputLabel>Plan</InputLabel>
            <Controller
              name="planId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Plan">
                  {plans.map((plan) => (
                    <MenuItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.planId && (
              <Typography color="error" variant="body2">
                {errors.planId.message}
              </Typography>
            )}
          </FormControl>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Submit Update
          </Button>
        </form>
      )}
    </Box>
  );
};

export default UpdateCourse;
