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
const CreateSchoolClass = ({ studyLevelId }) => {
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
    defaultValues: {
      name: "",
      capacity: "",
      studyLevelId: studyLevelId || "", // ✅ هنا نحط default جاي من props
    },
  });

  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  const onSubmit = (data) => {
    // لو studyLevelId جاي من props، نضمن إنه يتبعت
    const payload = {
      ...data,
      studyLevelId: studyLevelId || data.studyLevelId,
    };
    dispatch(actSchoolClass({ data: payload, token }));
    reset({
      name: "",
      capacity: "",
      studyLevelId: studyLevelId || "", // reset بنفس القيمة
    });
  };

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetSchoolClassState()), 3000);
    }
  }, [success, dispatch, error]);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", m: 4 }}>
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

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateSchoolClass;
