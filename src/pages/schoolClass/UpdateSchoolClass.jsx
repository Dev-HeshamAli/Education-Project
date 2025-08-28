import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";
import { updateSchoolClass } from "../../store/schoolClass/updateSchoolClass/schoolClassActions";
import { resetSchoolClassState } from "../../store/schoolClass/updateSchoolClass/updateSchoolClassSlice";

const schema = yup.object().shape({
  studyLevelId: yup.string().required("Study level is required"),
  classId: yup.string().required("Class is required"),
  name: yup.string().required("Class name is required"),
  capacity: yup
    .number()
    .typeError("Capacity must be a number")
    .required("Capacity is required")
    .positive("Capacity must be positive"),
});

const UpdateSchoolClass = ({ studyLevelId, classId, capacity, className }) => {
  console.log(capacity);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const schoolClasses = useSelector((state) => state.schoolClassId.list);
  const { error, success } = useSelector((state) => state.updateSchoolClass);

  const [isInitialized, setIsInitialized] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studyLevelId: studyLevelId || "",
      classId: classId || "",
      name: className || "",
      capacity: capacity || "",
    },
  });

  // Watch form values
  const watchedStudyLevelId = watch("studyLevelId");
  const watchedClassId = watch("classId");

  // Fetch study levels once
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  // Initialize form with props when component mounts
  useEffect(() => {
    if (studyLevelId && classId && capacity && className && !isInitialized) {
      setValue("studyLevelId", studyLevelId);
      setValue("classId", classId);
      setValue("name", className);
      setValue("capacity", capacity);
      setIsInitialized(true);
    }
  }, [studyLevelId, classId, capacity, className, setValue, isInitialized]);

  // Fetch school classes when studyLevelId changes
  useEffect(() => {
    if (token && watchedStudyLevelId) {
      dispatch(fetchSchoolClassId({ token, id: watchedStudyLevelId }));
    }
  }, [dispatch, token, watchedStudyLevelId]);

  // Auto-fill name and capacity when class is selected
  useEffect(() => {
    if (watchedClassId && schoolClasses.length > 0) {
      const selectedClass = schoolClasses.find(
        (cls) => cls.id === Number(watchedClassId)
      );

      if (selectedClass) {
        // Only auto-fill if we're not in initialization phase
        if (isInitialized || !studyLevelId || !classId) {
          setValue("name", selectedClass.name);
          setValue("capacity", selectedClass.capacity);
        }
      }
    }
  }, [
    watchedClassId,
    schoolClasses,
    setValue,
    isInitialized,
    studyLevelId,
    classId,
  ]);

  // Reset success/error messages
  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetSchoolClassState()), 3000);
    }
  }, [success, error, dispatch]);

  const handleStudyLevelChange = (value, field) => {
    field.onChange(value);

    // Only reset class-related fields if we're changing to a different study level
    if (value !== studyLevelId) {
      setValue("classId", "");
      setValue("name", "");
      setValue("capacity", "");
    }
  };

  const handleClassChange = (value, field) => {
    field.onChange(value);

    // Find selected class and auto-fill its data
    const selectedClass = schoolClasses.find((cls) => cls.id === Number(value));

    if (selectedClass) {
      setValue("name", selectedClass.name);
      setValue("capacity", selectedClass.capacity);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      id: Number(data.classId),
      name: data.name,
      capacity: Number(data.capacity),
      studyLevelId: Number(data.studyLevelId),
    };
    dispatch(updateSchoolClass({ data: payload, token }));
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Card sx={{ width: 500, p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" mb={3}>
            Update School Class
          </Typography>

          {success && (
            <Alert severity="success" sx={{ my: 3 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ my: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Study Level Select */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Study Level</InputLabel>
              <Controller
                name="studyLevelId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Study Level"
                    onChange={(e) =>
                      handleStudyLevelChange(e.target.value, field)
                    }
                  >
                    {studyLevels.map((level) => (
                      <MenuItem key={level.id} value={level.id}>
                        {level.level}
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

            {/* Class Select */}
            {watchedStudyLevelId && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Class</InputLabel>
                <Controller
                  name="classId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Class"
                      onChange={(e) => handleClassChange(e.target.value, field)}
                    >
                      {schoolClasses.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.classId && (
                  <Typography color="error" variant="caption">
                    {errors.classId.message}
                  </Typography>
                )}
              </FormControl>
            )}

            {/* Name Field - Always show when classId is selected */}
            {watchedClassId && (
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Class Name"
                    sx={{ mb: 2 }}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            )}

            {/* Capacity Field - Always show when classId is selected */}
            {watchedClassId && (
              <Controller
                name="capacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Capacity"
                    type="number"
                    sx={{ mb: 2 }}
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                  />
                )}
              />
            )}

            {/* Submit Button */}
            {watchedClassId && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Update Class
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateSchoolClass;
