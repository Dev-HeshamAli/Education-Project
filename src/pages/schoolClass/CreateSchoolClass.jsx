import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { actSchoolClass } from "../../store/schoolClass/actSchoolClass";
import { resetSchoolClassState } from "../../store/schoolClass/schoolClassSlice";

// Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Class name is required"),
  capacity: yup
    .number()
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
  studyLevelId: yup.number().required("Study level is required"),
});

const CreateSchoolClass = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const { error, success } = useSelector((state) => state.createSchoolClass);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  const onSubmit = (data) => {
    // console.log("Submitted Data:", data);
    dispatch(actSchoolClass({ data: data, token }));
    reset();
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(resetSchoolClassState()), 3000);
    } else if (error) {
      setTimeout(() => dispatch(resetSchoolClassState()), 3000);
    }
  }, [success, dispatch, error]);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create School Class
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Class Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        {/* Capacity */}
        <Controller
          name="capacity"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Capacity"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.capacity}
              helperText={errors.capacity?.message}
            />
          )}
        />

        {/* Study Level Select */}
        <Controller
          name="studyLevelId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.studyLevelId}
            >
              <InputLabel>Study Level</InputLabel>
              <Select {...field} label="Study Level">
                {studyLevels?.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.level}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="error">
                {errors.studyLevelId?.message}
              </Typography>
            </FormControl>
          )}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateSchoolClass;
