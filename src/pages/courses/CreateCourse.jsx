import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchStages } from "../../store/shared/stage/actGetStage";
import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
import { actCreateCourse } from "../../store/courses/actCreateCourse";
import { clearMessages } from "../../store/courses/createCourseSlice";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  studyLevelId: yup.number().required(),
  stageId: yup.number().required(),
  semesterId: yup.number().required(),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive"),
  offlinePrice: yup
    .number()
    .required("offlinePrice is required")
    .positive("offlinePrice must be positive"),
  discountPercentage: yup
    .number()
    .required("Discount percentage is required")
    .min(0, "Discount percentage must be at least 0")
    .max(100, "Discount percentage must be at most 100"),
  offlineDiscountPercentage: yup
    .number()
    .required("Discount percentage is required")
    .min(0, "Discount percentage must be at least 0")
    .max(100, "Discount percentage must be at most 100"),
  plans: yup.array().of(
    yup.object().shape({
      planId: yup.number().required("Plan is required"),
    })
  ),
});

const CreateCourse = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchPlans());
    dispatch(fetchStudyLevels());
    dispatch(fetchStages());
    dispatch(fetchSemesters());
  }, [dispatch]);

  const plans = useSelector((state) => state.plansId.list);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const stages = useSelector((state) => state.stageId.list);
  const semesters = useSelector((state) => state.semestersId.list);
  const courseState = useSelector((state) => state.createCourse);

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      plans: [{ planId: "" }],
    },
  });

  // useFieldArray للتحكم في Array الحقول
  const { fields, append, remove } = useFieldArray({
    control,
    name: "plans",
  });

  // const onSubmit = (data) => {
  //   // نحول الـ plans بحيث تبقى Array من الـ id
  //   const finalData = {
  //     ...data,
  //     plans: data.plans.map((p) => p.planId),
  //   };

  //   dispatch(actCreateCourse({ data: finalData, token }));
  //   reset();
  // };

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      plans: data.plans.map((p) => p.planId),

      discountPercentage: data.discountPercentage / 100,
      offlineDiscountPercentage: data.offlineDiscountPercentage / 100,
    };

    dispatch(actCreateCourse({ data: finalData, token }));
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
        <Alert severity="success" sx={{ mb: 2 }}>
          {courseState.successMessage}
        </Alert>
      )}

      {courseState.errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {courseState.errorMessage}
        </Alert>
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

        {fields.map((field, index) => (
          <Box key={field.id} display="flex" alignItems="center" gap={1}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Plan</InputLabel>
              <Controller
                name={`plans.${index}.planId`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select {...field} label="Plan">
                    <MenuItem value="">
                      <em>Select Plan</em>
                    </MenuItem>
                    {plans.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.plans?.[index]?.planId && (
                <Typography color="error" variant="caption">
                  {errors.plans[index].planId.message}
                </Typography>
              )}
            </FormControl>
            {/* زرار حذف */}
            <IconButton
              color="error"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              <DeleteIcon />
            </IconButton>
            {/* زرار إضافة */}
            {index === fields.length - 1 && (
              <IconButton
                color="primary"
                onClick={() => append({ planId: "" })}
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
        ))}

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

        <TextField
          label="Price"
          fullWidth
          margin="normal"
          {...register("price")}
          error={!!errors.price}
          helperText={errors.price?.message}
        />
        <TextField
          label="Discount Percentage"
          fullWidth
          margin="normal"
          {...register("discountPercentage")}
          error={!!errors.discountPercentage}
          helperText={errors.discountPercentage?.message}
        />
        <TextField
          label="Offline Price"
          fullWidth
          margin="normal"
          {...register("offlinePrice")}
          error={!!errors.offlinePrice}
          helperText={errors.offlinePrice?.message}
        />

        <TextField
          label="Offline Discount Percentage"
          fullWidth
          margin="normal"
          {...register("offlineDiscountPercentage")}
          error={!!errors.offlineDiscountPercentage}
          helperText={errors.offlineDiscountPercentage?.message}
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
