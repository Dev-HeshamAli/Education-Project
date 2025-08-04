// CreateCourse.jsx
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchStages } from "../../store/shared/stage/actGetStage";
import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
import { actCreateCourse } from "../../store/courses/actCreateCourse";
import { clearMessages } from "../../store/courses/createCourseSlice";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  academicYearId: yup.number().required(),
  planId: yup.number().required(),
  studyLevelId: yup.number().required(),
  stageId: yup.number().required(),
  semesterId: yup.number().required(),
});

const CreateCourse = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchPlans());
    dispatch(fetchStudyLevels());
    dispatch(fetchStages());
    dispatch(fetchSemesters());
  }, [dispatch]);

  const plans = useSelector((state) => state.plansId.list);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const stages = useSelector((state) => state.stageId.list);
  const semesters = useSelector((state) => state.semestersId.list);
  const academicYears = useSelector((state) => state.academicYearsId.list);
  const courseState = useSelector((state) => state.createCourse);

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(actCreateCourse({ data, token }));
    reset();
  };

  useEffect(() => {
    if (courseState.successMessage || courseState.errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [courseState.successMessage, courseState.errorMessage, dispatch]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Create Course
      </Typography>

      {courseState.successMessage && (
        <Typography
          sx={{ fontWeight: "bold", fontSize: "20px", textAlign: "center" }}
          color="success.main"
          mt={2}
        >
          {courseState.successMessage}
        </Typography>
      )}

      {courseState.errorMessage && (
        <Typography
          sx={{ fontWeight: "bold", fontSize: "20px", textAlign: "center" }}
          color="error.main"
          mt={2}
        >
          {courseState.errorMessage}
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        {/* Select Fields */}
        <SelectField
          label="Academic Year"
          name="academicYearId"
          control={control}
          error={errors.academicYearId}
          options={academicYears}
        />

        <SelectField
          label="Plan"
          name="planId"
          control={control}
          error={errors.planId}
          options={plans}
        />

        <SelectField
          label="Study Level"
          name="studyLevelId"
          control={control}
          error={errors.studyLevelId}
          options={studyLevels}
        />

        <SelectField
          label="Stage"
          name="stageId"
          control={control}
          error={errors.stageId}
          options={stages}
        />

        <SelectField
          label="Semester"
          name="semesterId"
          control={control}
          error={errors.semesterId}
          options={semesters}
        />

        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateCourse;

const SelectField = ({ label, name, control, error, options = [] }) => (
  <FormControl fullWidth margin="normal" error={!!error}>
    <InputLabel>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Select {...field} label={label}>
          <MenuItem value="">
            <em>Select {label}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name || option.level || option.date}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    {error && (
      <Typography color="error" variant="caption">
        {error.message}
      </Typography>
    )}
  </FormControl>
);
